const express = require("express");
const router = express.Router();
const {loginUser} = require('../controllers/authController')
const { addFlightQuery,getFlightsDurationSum,getAllFlights, getUserProfile, getVisitedCountries, addVisitedCountry, removeVisitedCountry } = require("../controllers/queriesController");
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
router.post('/get-visited-countries', getVisitedCountries)
router.post('/add-visited-country', addVisitedCountry)
router.post('/remove-visited-country', removeVisitedCountry)
module.exports = router;