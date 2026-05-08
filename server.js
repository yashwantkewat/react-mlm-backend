const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();


// =============================
// IMPORT ROUTES
// =============================

// auth routes
const authRoutes =
    require("./src/routes/authRoutes");

// user profile routes
const userRoutes =
    require("./src/routes/userRoutes");

// MLM team routes
const teamRoutes =
    require("./src/routes/teamRoutes");

// wallet & transactions routes
const walletRoutes =
    require("./src/routes/walletRoutes");

// user dashboard routes
const dashboardRoutes =
    require("./src/routes/dashboardRoutes");

// admin panel routes
const adminRoutes =
    require("./src/routes/adminRoutes");

// KYC routes
const kycRoutes =
    require("./src/routes/kycRoutes");



// =============================
// GLOBAL MIDDLEWARES
// =============================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);



// =============================
// USER ROUTES
// =============================

// authentication
app.use("/api/auth", authRoutes);

// user profile
app.use("/api/user", userRoutes);

// MLM team APIs
app.use("/api/team", teamRoutes);

// wallet APIs
app.use("/api/wallet", walletRoutes);

// dashboard APIs
app.use("/api/dashboard", dashboardRoutes);

// KYC APIs
app.use("/api/kyc", kycRoutes);



// =============================
// ADMIN ROUTES
// =============================

app.use("/api/admin", adminRoutes);



// =============================
// STATIC FILES
// =============================

// uploaded KYC documents
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);



// =============================
// HEALTH CHECK ROUTE
// =============================

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "MLM Backend Running"
    });

});



// =============================
// SERVER
// =============================

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});