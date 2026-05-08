const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const {
    getWalletBalance,
    getTransactionHistory
} = require("../controllers/walletController");


// wallet balance
router.get(
    "/balance",
    authMiddleware,
    getWalletBalance
);


// transaction history
router.get(
    "/history",
    authMiddleware,
    getTransactionHistory
);

module.exports = router;