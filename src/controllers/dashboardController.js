const db = require("../config/db");


// ================= DASHBOARD STATS =================

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        // Wallet balance
        const [wallet] = await db.query(
            `
            SELECT balance
            FROM wallet
            WHERE user_id = ?
            `,
            [userId]
        );

        // Direct team
        const [directTeam] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM referral_tree
            WHERE parent_id = ?
            AND level = 1
            `,
            [userId]
        );

        // Total team
        const [totalTeam] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM referral_tree
            WHERE parent_id = ?
            `,
            [userId]
        );

        // Total earnings
        const [earnings] = await db.query(
            `
            SELECT SUM(amount) AS total
            FROM transactions
            WHERE user_id = ?
            AND type = 'credit'
            `,
            [userId]
        );

        // Recent transactions
        const [recentTransactions] = await db.query(
            `
            SELECT
                amount,
                type,
                level,
                description,
                created_at
            FROM transactions
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 5
            `,
            [userId]
        );

        return res.status(200).json({
            success: true,
            stats: {
                walletBalance:
                    wallet[0]?.balance || 0,

                directTeam:
                    directTeam[0].total,

                totalTeam:
                    totalTeam[0].total,

                totalEarnings:
                    earnings[0]?.total || 0
            },

            recentTransactions
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getDashboardStats
};