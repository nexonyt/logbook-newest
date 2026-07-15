const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const util = require('util');
const airports = require("../../client/src/data/airports.json");

const app = express();
app.options('*', cors());

console.log(process.env.DB_HOST);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const query = util.promisify(db.query).bind(db);
const addFlightQuery = (req, res) => {
  console.log(req.body);


  const userID = req.body.userID;
  const flightNumber = req.body.flightNumber;
  const flightDeparture = req.body.flightDeparture;
  const flightArrival = req.body.flightArrival;
  const flightAirline = req.body.flightAirline;
  const flightDestIATA = req.body.flightDestIATA;
  const flightDestICAO = req.body.flightDestICAO;
  const flightArrivalIATA = req.body.flightArrivalIATA;
  const flightArrivalICAO = req.body.flightArrivalICAO;
  const fliAircraft = req.body.fliAircraft;
  const flightDelay = req.body.fliDelay;
  const flightDuration = req.body.flightDuration;
  const fliSeats = req.body.fliSeats;
  const fliDetails = req.body.fliDetails;
  const fliAircraftType = req.body.fliAircraftType;

  const SQL = `INSERT INTO flights (user_id,fli_dep_time,fli_arr_time,fli_airline,fli_number,fli_dest_air_iata,fli_dest_air_icao,fli_arr_air_iata,fli_arr_air_icao,fli_aircraft,fli_delay,fli_duration,notes,fli_seat,fli_aircraft_type) VALUES (${userID}, "${flightDeparture}", "${flightArrival}","${flightAirline}","${flightNumber}","${flightDestIATA}","${flightDestICAO}","${flightArrivalIATA}","${flightArrivalICAO}","${fliAircraft}","${flightDelay}","${flightDuration}","${fliDetails}","${fliSeats}","${fliAircraftType}");`;
  db.query(SQL, (err, result) => {
    if (err) {
      console.error('error connecting: ' + err.stack);
      res.status(409).send('Wystąpił problem z połączeniem z bazą danych');
    }
    else res.send("added");
  });
};


const getAllFlights = (req, res) => {
  const userID = req.body.userID;
  const getAllFlightsSQL = `select fli_dest_air_icao,fli_dest_air_iata,fli_arr_air_icao,fli_arr_air_iata,fli_dep_time,fli_arr_time,fli_airline,fli_aircraft,fli_number,fli_duration,notes,fli_seat,fli_delay,fli_aircraft_type from flights where user_id = ${userID} order by fli_dep_time DESC;`

  db.query(getAllFlightsSQL, (err, result) => {
    if (err) {
      console.error('error connecting: ' + err.stack);
      res.status(500).send('Error retrieving flight data');
      return;
    }
    else {
      res.send(result)
    }
  });
}

const getUserProfile = (req, res) => {
  const userID = req.body.userID;
  const SQL = `SELECT id, name, surname, date_of_birth, is_admin, last_login, role, home_airport_icao, (SELECT count(*) FROM flights WHERE user_id = 1) AS flights_number, (SELECT CONCAT(FLOOR(SUM(TIME_TO_SEC(fli_duration)) / 3600), 'h ', MOD(FLOOR(SUM(TIME_TO_SEC(fli_duration)) / 60), 60), 'm') AS total_duration FROM flights WHERE user_id = 1) AS total_hours, (SELECT DATE(fli_dep_time) AS last_flight_date FROM flights WHERE user_id = 1 ORDER BY fli_dep_time DESC  LIMIT 1) AS last_flight FROM flights_users WHERE id = 1;`
  db.query(SQL, (err, result) => {
    if (err) {
      console.error('error connecting: ' + err.stack);
      res.status(500).send('Error retrieving flight data');
      return;
    }
    else {
      res.json(result[0])
    }
  });

}

const getFlightsDurationSum = async (req, res) => {
  const userID = req.body.userID;

  try {
    const sumTimeOfFlights = `SELECT CONCAT(FLOOR(SUM(TIME_TO_SEC(fli_duration)) / 3600), 'h ', MOD(FLOOR(SUM(TIME_TO_SEC(fli_duration)) / 60), 60), 'm') AS total_duration FROM flights WHERE user_id = ${userID};`;
    const longestFlightSQL = `SELECT DATE_FORMAT(SEC_TO_TIME(TIME_TO_SEC(fli_duration)), '%H:%i') AS max_duration, fli_dest_air_icao, fli_dest_air_iata, fli_arr_air_icao, fli_arr_air_iata, fli_airline FROM flights WHERE user_id = ${userID} ORDER BY TIME_TO_SEC(fli_duration) DESC LIMIT 1;`;
    const maxDelaySQL = `SELECT fli_number,fli_dest_air_icao,fli_dest_air_iata, fli_arr_air_icao,fli_arr_air_iata, fli_delay,fli_airline AS max_delay  FROM flights WHERE user_id = ${userID} ORDER BY fli_delay DESC LIMIT 1;`;
    const mostChosenAirlineSQL = `SELECT fli_airline, COUNT(*) AS count FROM flights WHERE user_id = ${userID} GROUP BY fli_airline ORDER BY count DESC LIMIT 1;`;
    const mostFrequentDepartureAirportSQL = `SELECT fli_dest_air_icao,fli_dest_air_iata, count(fli_dest_air_iata) AS count FROM flights WHERE user_id = ${userID} GROUP BY fli_dest_air_iata ORDER BY count DESC LIMIT 5;`;
    const airlineWithLeastDelaySQL = `SELECT fli_airline, ROUND(AVG(TIME_TO_SEC(fli_delay)) / 3600, 1) AS avg_delay FROM flights WHERE user_id = ${userID} AND fli_delay IS NOT NULL AND fli_delay != '' GROUP BY fli_airline ORDER BY avg_delay ASC LIMIT 1;`;
    const mostFrequentDestinationAirportSQL = `SELECT fli_arr_air_icao, fli_arr_air_iata, count(*) AS count FROM flights WHERE user_id = ${userID} GROUP BY fli_arr_air_icao ORDER BY count DESC;`;
    const mostFlightAircraft = `select fli_aircraft AS "aircraft",count(*) AS "number_of_flights"  from flights WHERE user_id = ${userID} GROUP BY fli_aircraft ORDER BY count(*) DESC LIMIT 1;`;
    const uniqueuAirportsSQL = `SELECT fli_dest_air_icao AS airport FROM flights WHERE user_id = ${userID} UNION SELECT fli_arr_air_icao AS airport FROM flights WHERE user_id = ${userID};`;

    // Execute all queries concurrently
    const [
      sumTimeOfFlightsRes,
      longestFlightRes,
      maxDelayRes,
      mostChosenAirlineRes,
      mostFrequentDepartureRes,
      leastDelayAirlineRes,
      mostFrequentDestinationRes,
      mostFlightAircraftRes,
      uniqueAirportsRes
    ] = await Promise.all([
      query(sumTimeOfFlights),
      query(longestFlightSQL),
      query(maxDelaySQL),
      query(mostChosenAirlineSQL),
      query(mostFrequentDepartureAirportSQL),
      query(airlineWithLeastDelaySQL),
      query(mostFrequentDestinationAirportSQL),
      query(mostFlightAircraft),
      query(uniqueuAirportsSQL)
    ]);

    // Deduce home base airport (departure airport with the highest count)
    const homeBaseAirport = mostFrequentDepartureRes && mostFrequentDepartureRes[0] ? mostFrequentDepartureRes[0].fli_dest_air_icao : null;
    const homeBaseCountry = homeBaseAirport && airports[homeBaseAirport] ? airports[homeBaseAirport].country : null;

    // Filter most frequent destinations:
    // 1. Exclude the home base airport itself (e.g. EPKK)
    // 2. Exclude any airport in the country of the home base (e.g. Poland / PL)
    let filteredDestinations = mostFrequentDestinationRes || [];
    if (homeBaseAirport || homeBaseCountry) {
      filteredDestinations = filteredDestinations.filter(dest => {
        const isBaseAirport = dest.fli_arr_air_icao === homeBaseAirport;
        const destCountry = airports[dest.fli_arr_air_icao] ? airports[dest.fli_arr_air_icao].country : null;
        const isInBaseCountry = destCountry && destCountry === homeBaseCountry;
        return !isBaseAirport && !isInBaseCountry;
      });
    }

    const responsesFromDB = {
      sum_time_of_flights: sumTimeOfFlightsRes ? sumTimeOfFlightsRes : null,
      longest_flight: longestFlightRes,
      max_delay: maxDelayRes ? maxDelayRes : null,
      most_chosen_airline: mostChosenAirlineRes ? mostChosenAirlineRes : null,
      most_frequent_departure_airport: mostFrequentDepartureRes ? mostFrequentDepartureRes : null,
      least_delay_airline: leastDelayAirlineRes ? leastDelayAirlineRes : null,
      most_frequent_destination: filteredDestinations.slice(0, 5), // Keep top 5 after filtering
      most_flight_aircraft: mostFlightAircraftRes ? mostFlightAircraftRes : null,
      unique_airports: uniqueAirportsRes ? uniqueAirportsRes.map(r => r.airport) : null
    };

    res.json(responsesFromDB);
  } catch (err) {
    console.error('Error running stats queries:', err);
    res.status(500).send('Error retrieving stats data');
  }
};


const getVisitedCountries = (req, res) => {
  const userID = req.body.userID;
  db.query('SELECT country_code FROM user_visited_countries WHERE user_id = ?', [userID], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error retrieving visited countries');
    }
    res.json(result.map(r => r.country_code));
  });
};

const addVisitedCountry = (req, res) => {
  const { userID, countryCode } = req.body;
  db.query('INSERT IGNORE INTO user_visited_countries (user_id, country_code) VALUES (?, ?)', [userID, countryCode], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error adding visited country');
    }
    res.send('added');
  });
};

const removeVisitedCountry = (req, res) => {
  const { userID, countryCode } = req.body;
  db.query('DELETE FROM user_visited_countries WHERE user_id = ? AND country_code = ?', [userID, countryCode], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error removing visited country');
    }
    res.send('removed');
  });
};

module.exports = { addFlightQuery, getFlightsDurationSum, getAllFlights, getUserProfile, getVisitedCountries, addVisitedCountry, removeVisitedCountry };