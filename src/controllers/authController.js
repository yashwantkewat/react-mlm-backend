const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const distributeCommission = require("../helpers/commissionHelper");

// ================= REGISTER USER =================

const registerUser = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            referred_by
        } = req.body;

        // validation
        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });

        }

        // check existing email
        const [existingUser] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {

            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });

        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // generate referral code
        const referralCode =
            name.substring(0, 3).toUpperCase() +
            Math.floor(1000 + Math.random() * 9000);

        let parentUser = null;

        // validate referral code
        if (referred_by) {

            const [parentData] = await db.query(
                "SELECT * FROM users WHERE referral_code = ?",
                [referred_by]
            );

            if (parentData.length === 0) {

                return res.status(400).json({
                    success: false,
                    message: "Invalid referral code"
                });

            }

            parentUser = parentData[0];

        }

        // insert new user
        const [newUser] = await db.query(
            `
            INSERT INTO users
            (
                name,
                email,
                password,
                referral_code,
                referred_by
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                name,
                email,
                hashedPassword,
                referralCode,
                referred_by || null
            ]
        );

        const newUserId = newUser.insertId;
        await db.query(
            `
            INSERT INTO wallet
            (
                user_id,
                balance
            )
            VALUES (?, ?)
            `,
            [newUserId, 0]
        );
        // insert into referral tree
      // insert into referral tree
if (parentUser) {

    // level 1 relation
    await db.query(
        `
        INSERT INTO referral_tree
        (
            user_id,
            parent_id,
            level
        )
        VALUES (?, ?, ?)
        `,
        [
            newUserId,
            parentUser.id,
            1
        ]
    );

    // get all uplines
    const [uplines] = await db.query(
        `
        SELECT parent_id, level
        FROM referral_tree
        WHERE user_id = ?
        `,
        [parentUser.id]
    );

    // insert indirect levels
    for (const upline of uplines) {

        await db.query(
            `
            INSERT INTO referral_tree
            (
                user_id,
                parent_id,
                level
            )
            VALUES (?, ?, ?)
            `,
            [
                newUserId,
                upline.parent_id,
                upline.level + 1
            ]
        );

    }

}
await distributeCommission(newUserId);

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            referralCode
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= LOGIN USER =================

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // validation
        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and password required"
            });

        }

        // find user
        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        const user = users[0];

        // compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid password"
            });

        }

        // generate token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                referral_code: user.referral_code,
                role: user.role
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


module.exports = {
    registerUser,
    loginUser
};