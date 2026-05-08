const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const {
    getDirectTeam,
    getIndirectTeam,
    getTotalTeam,
    getTeamTree
} = require("../controllers/teamController");


// direct team
router.get(
    "/direct",
    authMiddleware,
    getDirectTeam
);


// indirect team
router.get(
    "/indirect",
    authMiddleware,
    getIndirectTeam
);


// total team
router.get(
    "/total",
    authMiddleware,
    getTotalTeam
);
// treee hierarchy

router.get(
    "/tree",
    authMiddleware,
    getTeamTree
);

module.exports = router;