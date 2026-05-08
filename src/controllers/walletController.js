const db = require("../config/db");


// ================= WALLET BALANCE =================

const getWalletBalance = async (req, res) => {

    try {

        const userId = req.user.id;

        const [wallet] = await db.query(
            `
            SELECT *
            FROM wallet
            WHERE user_id = ?
            `,
            [userId]
        );

        return res.status(200).json({
            success: true,
            wallet: wallet[0] || {
                balance: 0
            }
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= TRANSACTION HISTORY =================

const getTransactionHistory = async (req, res) => {

    try {

        const userId = req.user.id;

        const [transactions] = await db.query(
            `
            SELECT *
            FROM transactions
            WHERE user_id = ?
            ORDER BY created_at DESC
            `,
            [userId]
        );

        return res.status(200).json({
            success: true,
            total: transactions.length,
            transactions
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


module.exports = {
    getWalletBalance,
    getTransactionHistory
};