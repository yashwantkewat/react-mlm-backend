const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const db = require("../config/db");


// ================= PROFILE =================

router.get(
    "/profile",
    authMiddleware,
    async (req, res) => {

        try {

            const userId = req.user.id;

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
                WHERE id = ?
                `,
                [userId]
            );

            return res.status(200).json({
                success: true,
                user: users[0]
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }
);

router.put(
    "/profile/update",
    authMiddleware,
    async (req, res) => {
      try {
        const userId = req.user.id;
  
        const { name, email } = req.body;
  
        // 🛑 validation
        if (!name || !email) {
          return res.status(400).json({
            success: false,
            message: "Name and Email are required"
          });
        }
  
        // 📌 update query
        await db.query(
          `
          UPDATE users
          SET name = ?, email = ?
          WHERE id = ?
          `,
          [name, email, userId]
        );
  
        // 🔄 return updated user
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
          WHERE id = ?
          `,
          [userId]
        );
  
        return res.status(200).json({
          success: true,
          message: "Profile updated successfully",
          user: users[0]
        });
  
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message
        });
      }
    }
  );

module.exports = router;