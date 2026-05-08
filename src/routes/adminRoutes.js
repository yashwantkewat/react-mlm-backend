const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const adminMiddleware =
require("../middleware/adminMiddleware");

const {
    getAllUsers,
    getAdminDashboard,
    getAllWallets,
    updateCommission,
    manualWalletCredit,getAllTransactions,getPayoutReports
} = require("../controllers/adminController");


// all users
router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAllUsers
);


// admin dashboard
router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getAdminDashboard
);


// all wallets
router.get(
    "/wallets",
    authMiddleware,
    adminMiddleware,
    getAllWallets
);


// update commission
router.put(
    "/commission",
    authMiddleware,
    adminMiddleware,
    updateCommission
);


// manual wallet credit
router.post(
    "/wallet-credit",
    authMiddleware,
    adminMiddleware,
    manualWalletCredit
);

router.get(
    "/wallet-transactions",
    authMiddleware,
    adminMiddleware,
    getAllTransactions
);

router.get(
    "/reports",
    authMiddleware,
    adminMiddleware,
    getPayoutReports
);

module.exports = router;