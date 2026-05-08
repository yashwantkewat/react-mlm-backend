const db = require("../config/db");

const distributeCommission = async (newUserId) => {

    try {

        // get all uplines
        const [uplines] = await db.query(
            `
            SELECT
                parent_id,
                level
            FROM referral_tree
            WHERE user_id = ?
            ORDER BY level ASC
            `,
            [newUserId]
        );

        // loop through all uplines
        for (const upline of uplines) {

            // get commission amount
            const [commissionData] = await db.query(
                `
                SELECT amount
                FROM commission_settings
                WHERE level = ?
                `,
                [upline.level]
            );

            // skip if no commission
            if (commissionData.length === 0) {
                continue;
            }

            const commissionAmount =
                commissionData[0].amount;

            // =========================
            // CHECK WALLET EXISTS
            // =========================

            const [wallets] = await db.query(
                `
                SELECT *
                FROM wallet
                WHERE user_id = ?
                `,
                [upline.parent_id]
            );

            // =========================
            // CREATE WALLET IF NOT EXISTS
            // =========================

            if (wallets.length === 0) {

                await db.query(
                    `
                    INSERT INTO wallet
                    (
                        user_id,
                        balance
                    )
                    VALUES (?, ?)
                    `,
                    [
                        upline.parent_id,
                        0
                    ]
                );

            }

            // =========================
            // UPDATE WALLET BALANCE
            // =========================

            await db.query(
                `
                UPDATE wallet
                SET balance = balance + ?
                WHERE user_id = ?
                `,
                [
                    commissionAmount,
                    upline.parent_id
                ]
            );

            // =========================
            // INSERT TRANSACTION
            // =========================

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
                    upline.parent_id,
                    commissionAmount,
                    "credit",
                    upline.level,
                    `Level ${upline.level} referral commission`
                ]
            );

        }

    } catch (error) {

        console.log(
            "Commission Error:",
            error.message
        );

    }

};

module.exports = distributeCommission;