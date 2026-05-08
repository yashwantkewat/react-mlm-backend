const db = require("../config/db");


// ================= DIRECT TEAM =================

const getDirectTeam = async (req, res) => {

    try {

        const userId = req.user.id;

        const [team] = await db.query(
            `
            SELECT
                users.id,
                users.name,
                users.email,
                users.referral_code,
                referral_tree.level
            FROM referral_tree
            JOIN users
            ON users.id = referral_tree.user_id
            WHERE referral_tree.parent_id = ?
            AND referral_tree.level = 1
            `,
            [userId]
        );
        console.log(req.user);
        return res.status(200).json({
            success: true,
            total: team.length,
            team
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= INDIRECT TEAM =================

const getIndirectTeam = async (req, res) => {

    try {

        const userId = req.user.id;

        const [team] = await db.query(
            `
            SELECT
                users.id,
                users.name,
                users.email,
                users.referral_code,
                referral_tree.level
            FROM referral_tree
            JOIN users
            ON users.id = referral_tree.user_id
            WHERE referral_tree.parent_id = ?
            AND referral_tree.level > 1
            ORDER BY referral_tree.level ASC
            `,
            [userId]
        );

        return res.status(200).json({
            success: true,
            total: team.length,
            team
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= TOTAL TEAM =================

const getTotalTeam = async (req, res) => {

    try {

        const userId = req.user.id;

        const [team] = await db.query(
            `
            SELECT
                users.id,
                users.name,
                users.email,
                users.referral_code,
                referral_tree.level
            FROM referral_tree
            JOIN users
            ON users.id = referral_tree.user_id
            WHERE referral_tree.parent_id = ?
            ORDER BY referral_tree.level ASC
            `,
            [userId]
        );

        return res.status(200).json({
            success: true,
            total: team.length,
            team
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getTeamTree = async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.query(`
            SELECT 
                rt.parent_id,
                rt.user_id,
                rt.level,
                u.name,
                u.email,
                u.referral_code
            FROM referral_tree rt
            JOIN users u ON u.id = rt.user_id
            ORDER BY rt.level ASC
        `);

        const buildTree = (parentId) => {
            return rows
                .filter(row => row.parent_id === parentId)
                .map(row => ({
                    id: row.user_id,
                    name: row.name,
                    email: row.email,
                    referral_code: row.referral_code,
                    level: row.level,
                    children: buildTree(row.user_id)
                }));
        };

        const [rootUser] = await db.query(
            `
            SELECT id, name, email, referral_code
            FROM users
            WHERE id = ?
            `,
            [userId]
        );

        const tree = {
            ...rootUser[0],
            children: buildTree(userId)
        };

        return res.status(200).json({
            success: true,
            tree
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDirectTeam,
    getIndirectTeam,
    getTotalTeam,
    getTeamTree
};