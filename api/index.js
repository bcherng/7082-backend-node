// base route
module.exports = (req, res) => {
  // Define the available routes
  const availableRoutes = {
    "/api/login": "POST",
    "/api/signup": "POST",
    "/api/workout-routine": "GET",
    "/api/questionnaire": "GET, POST"
  };

  // Create a formatted string of available routes
  let routeList = "Available Routes:\n";
  for (let route in availableRoutes) {
    routeList += `${route}: ${availableRoutes[route]}\n`;
  }

  // Send the available routes as a response
  res.status(200).send(routeList);
};
