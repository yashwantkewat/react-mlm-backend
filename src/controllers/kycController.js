const db = require("../config/db");


// ================= SUBMIT KYC =================

const submitKYC = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            document_type,
            document_number
        } = req.body;

        const document_image =
            req.file?.filename;

        // validation
        if (
            !document_type ||
            !document_number ||
            !document_image
        ) {

            return res.status(400).json({
                success: false,
                message: "All fields required"
            });

        }

        // check existing kyc
        const [existingKYC] = await db.query(
            `
            SELECT *
            FROM kyc
            WHERE user_id = ?
            `,
            [userId]
        );

        if (existingKYC.length > 0) {

            return res.status(400).json({
                success: false,
                message: "KYC already submitted"
            });

        }

        // insert kyc
        await db.query(
            `
            INSERT INTO kyc
            (
                user_id,
                document_type,
                document_number,
                document_image
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                userId,
                document_type,
                document_number,
                document_image
            ]
        );

        return res.status(201).json({
            success: true,
            message: "KYC Submitted Successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= GET MY KYC =================

const getMyKYC = async (req, res) => {

    try {

        const userId = req.user.id;

        const [kyc] = await db.query(
            `
            SELECT *
            FROM kyc
            WHERE user_id = ?
            `,
            [userId]
        );

        return res.status(200).json({
            success: true,
            kyc: kyc[0] || null
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= ADMIN GET ALL KYC =================

const getAllKYC = async (req, res) => {

    try {

        const [kycs] = await db.query(
            `
            SELECT
                kyc.*,
                users.name,
                users.email
            FROM kyc
            JOIN users
            ON users.id = kyc.user_id
            ORDER BY kyc.id DESC
            `
        );

        return res.status(200).json({
            success: true,
            total: kycs.length,
            kycs
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= APPROVE / REJECT KYC =================

const updateKYCStatus = async (req, res) => {
    try {
        const { kyc_id, status } = req.body;

        const [result] = await db.query(
            `
            UPDATE kyc
            SET status = ?
            WHERE id = ?
            `,
            [status, kyc_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "KYC record not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: `KYC ${status} successfully`
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    submitKYC,
    getMyKYC,
    getAllKYC,
    updateKYCStatus
};