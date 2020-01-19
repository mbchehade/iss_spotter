/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 *
 *
 */



// this website is what is giving you your ip address.
//since it is a JSON you need to convert it from string to object using jason.parse.
//
const request = require('request');

//function (error, response, body) these are also callbacks nested inside the callback which is inside fetchMyIP function

const fetchMyIP = (callback) => {
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
    } else {
      const data = JSON.parse(body);
      const ip = data['ip'];
      callback(null, ip);
    }
  });
};


const fetchCoordsByIP = (ip, callback) => {
  request(`https://ipvigilante.com/${ip}`, (error, response, body) =>{
    //if there is no error, call back null.
  if(error){
    callback(error, null)
  }else if(response.statusCode !== 200){
    const msg = `Status Code ${response.statusCode} when fetching coords. Response: ${body}`;
    callback(Error(msg), null);
  } else {
    const info = JSON.parse(body);
    const latLongObj = {
      "latitude": info['data']['latitude'],
      "longitude": info['data']['longitude']
    };
    callback(null, latLongObj);
  }
  });
};

const fetchISSFlyOverTimes = function (coords, callback) {
  request('http://api.open-notify.org/iss-pass.json?lat=' + coords['latitude'] + '&lon=' + coords['longitude'], (error, response, body) => {
    if (error) {
      callback(error, null);
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching fly-over times. Response: ${body}`;
      callback(Error(msg), null);
    } else {
      const info = JSON.parse(body);
      const flyOverTimes = info['response'];

      callback(null, flyOverTimes);
    }
  });
};

const nextISSTimesForMyLocation = function (callback) {

  fetchMyIP(function (err, ip) {
    if (err) return;
    fetchCoordsByIp(ip, function (err, coords) {
      if (err) return;
      fetchISSFlyOverTimes(coords, function (err, flyString) {
        if (!err) {
          callback(null, flyString);
        } else {
          callback(err, null);
        }
      });
    });
  });
 
};


module.exports = { fetchISSFlyOverTimes };
module.exports = { nextISSTimesForMyLocation };
module.exports = { fetchMyIP, fetchCoordsByIP };