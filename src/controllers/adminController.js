const db = require("../config/db");


// ================= ALL USERS =================

const getAllUsers = async (req, res) => {

    try {

        const [users] = await db.query(
            `
            SELECT
                id,
                name,
                email,
                referral_code,
                referred_by,
                role,
                created_at
            FROM users
            ORDER BY id DESC
            `
        );

        return res.status(200).json({
            success: true,
            total: users.length,
            users
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= ADMIN DASHBOARD =================

// ================= ADMIN DASHBOARD =================

const getAdminDashboard = async (req, res) => {
    try {

        // Total users
        const [users] = await db.query(`
            SELECT COUNT(*) AS totalUsers
            FROM users
        `);

        // Total wallet balance
        const [wallets] = await db.query(`
            SELECT SUM(balance) AS totalBalance
            FROM wallet
        `);

        // Total transactions
        const [transactions] = await db.query(`
            SELECT COUNT(*) AS totalTransactions
            FROM transactions
        `);

        // Total commission distributed
        const [commissions] = await db.query(`
            SELECT SUM(amount) AS totalCommission
            FROM transactions
            WHERE type = 'credit'
        `);

        // Today's registrations
        const [todayUsers] = await db.query(`
            SELECT COUNT(*) AS total
            FROM users
            WHERE DATE(created_at) = CURDATE()
        `);

        // Today's transactions
        const [todayTransactions] = await db.query(`
            SELECT COUNT(*) AS total
            FROM transactions
            WHERE DATE(created_at) = CURDATE()
        `);

        // Pending KYC
        const [pendingKyc] = await db.query(`
            SELECT COUNT(*) AS total
            FROM kyc
            WHERE status = 'pending'
        `);

        // Recent users
        const [recentUsers] = await db.query(`
            SELECT
                id,
                name,
                email,
                created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT 5
        `);

        // Recent transactions
        const [recentTransactions] = await db.query(`
            SELECT
                t.id,
                u.name,
                t.amount,
                t.type,
                t.created_at
            FROM transactions t
            JOIN users u
            ON u.id = t.user_id
            ORDER BY t.created_at DESC
            LIMIT 5
        `);

        return res.status(200).json({
            success: true,

            dashboard: {
                totalUsers:
                    users[0].totalUsers,

                totalWalletBalance:
                    wallets[0].totalBalance || 0,

                totalTransactions:
                    transactions[0].totalTransactions,

                totalCommissionDistributed:
                    commissions[0].totalCommission || 0,

                newUsersToday:
                    todayUsers[0].total,

                todayTransactions:
                    todayTransactions[0].total,

                pendingKyc:
                    pendingKyc[0].total
            },

            recentUsers,
            recentTransactions
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ================= ALL WALLETS =================

const getAllWallets = async (req, res) => {

    try {

        const [wallets] = await db.query(
            `
            SELECT
                wallet.user_id,
                users.name,
                users.email,
                wallet.balance
            FROM wallet
            JOIN users
            ON users.id = wallet.user_id
            `
        );

        return res.status(200).json({
            success: true,
            total: wallets.length,
            wallets
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= UPDATE COMMISSION =================

const updateCommission = async (req, res) => {

    try {

        const { level, amount } = req.body;

        await db.query(
            `
            UPDATE commission_settings
            SET amount = ?
            WHERE level = ?
            `,
            [amount, level]
        );

        return res.status(200).json({
            success: true,
            message: `Level ${level} commission updated`
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


// ================= MANUAL WALLET CREDIT =================

const manualWalletCredit = async (req, res) => {

    try {

        const { user_id, amount } = req.body;

        // create wallet if missing
        const [wallet] = await db.query(
            `
            SELECT *
            FROM wallet
            WHERE user_id = ?
            `,
            [user_id]
        );

        if (wallet.length === 0) {

            await db.query(
                `
                INSERT INTO wallet
                (
                    user_id,
                    balance
                )
                VALUES (?, ?)
                `,
                [user_id, 0]
            );

        }

        // update balance
        await db.query(
            `
            UPDATE wallet
            SET balance = balance + ?
            WHERE user_id = ?
            `,
            [amount, user_id]
        );

        // transaction entry
        await db.query(
            `
            INSERT INTO transactions
            (
                user_id,
                amount,
                type,
                level,
                description
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                user_id,
                amount,
                "credit",
                0,
                "Manual admin credit"
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Wallet credited successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ================= ALL USER TRANSACTION =================

const getAllTransactions = async (req, res) => {
    try {
      const [transactions] = await db.query(`
        SELECT 
          t.id,
          u.name,
          u.email,
          t.amount,
          t.type,
          t.level,
          t.description,
          t.created_at
        FROM transactions t
        JOIN users u ON t.user_id = u.id
        ORDER BY t.created_at DESC
      `);
  
      res.status(200).json({
        success: true,
        transactions
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
// ================= ALL USER PAYOUT =================

  const getPayoutReports = async (req, res) => {
    try {

        // Total wallet balance
        const [walletBalance] = await db.query(`
            SELECT SUM(balance) as total_wallet_balance
            FROM wallet
        `);

        // Total credit
        const [credit] = await db.query(`
            SELECT SUM(amount) as total_credit
            FROM transactions
            WHERE type = 'credit'
        `);

        // Total debit
        const [debit] = await db.query(`
            SELECT SUM(amount) as total_debit
            FROM transactions
            WHERE type = 'debit'
        `);

        // Total transactions
        const [txCount] = await db.query(`
            SELECT COUNT(*) as total_transactions
            FROM transactions
        `);

        // Recent transactions
        const [recentTransactions] = await db.query(`
            SELECT
                t.id,
                u.name,
                u.email,
                t.amount,
                t.type,
                t.level,
                t.description,
                t.created_at
            FROM transactions t
            JOIN users u ON u.id = t.user_id
            ORDER BY t.created_at DESC
            LIMIT 10
        `);

        // User-wise summary
        const [userReports] = await db.query(`
            SELECT
                u.id,
                u.name,
                u.email,
                COALESCE(w.balance, 0) as wallet_balance,
                COUNT(t.id) as total_transactions,
                COALESCE(SUM(t.amount), 0) as total_amount
            FROM users u
            LEFT JOIN wallet w ON u.id = w.user_id
            LEFT JOIN transactions t ON u.id = t.user_id
            GROUP BY u.id
            ORDER BY total_amount DESC
        `);

        return res.status(200).json({
            success: true,
            report: {
                total_wallet_balance:
                    walletBalance[0].total_wallet_balance || 0,

                total_credit:
                    credit[0].total_credit || 0,

                total_debit:
                    debit[0].total_debit || 0,

                total_transactions:
                    txCount[0].total_transactions || 0
            },

            recentTransactions,
            userReports
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getAdminDashboard,
    getAllWallets,
    updateCommission,
    manualWalletCredit,
    getAllTransactions,getPayoutReports
};