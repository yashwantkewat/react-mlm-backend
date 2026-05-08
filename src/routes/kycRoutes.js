const express = require("express");

const router = express.Router();

const authMiddleware =
require("../middleware/authMiddleware");

const adminMiddleware =
require("../middleware/adminMiddleware");

const upload =
require("../config/multer");

const {
    submitKYC,
    getMyKYC,
    getAllKYC,
    updateKYCStatus
} = require("../controllers/kycController");


// submit kyc
router.post(
    "/submit",
    authMiddleware,
    upload.single("document_image"),
    submitKYC
);


// my kyc
router.get(
    "/my",
    authMiddleware,
    getMyKYC
);


// admin all kyc
router.get(
    "/all",
    authMiddleware,
    adminMiddleware,
    getAllKYC
);


// admin approve reject
router.put(
    "/update-status",
    authMiddleware,
    adminMiddleware,
    updateKYCStatus
);

module.exports = router;