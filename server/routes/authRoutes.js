const express = require("express");
const router = express.Router();
const {loginUser} = require('../controllers/authController')
const { addFlightQuery,getFlightsDurationSum,getAllFlights, getUserProfile } = require("../controllers/queriesController");
const cors = require("cors");

router.use(
  cors({
    credentials: false,
    // origin: "http://localhost:5173",
    origin: '*'
  })
);

//router.post("/register", registerUser);
router.post('/login',loginUser)
router.post('/addflightquery',addFlightQuery)
router.post('/getflightdurationsum',getFlightsDurationSum)
router.post('/getAllFlights',getAllFlights);
router.post('/get-user-profile',getUserProfile)
module.exports = router;