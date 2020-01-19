const { nextISSTimesForMyLocation } = require('./iss_promised');

nextISSTimesForMyLocation()
  .then((passTimes) => {
    // put my date parsin inside iss_promise
    // console.log(passTimes);
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });