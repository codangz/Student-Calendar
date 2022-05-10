const eventController = require('../controllers/event.controller');
// const { authJwt } = require("../middlewares");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.get('/api/event/:userId', eventController.find);
    app.post('/api/event/:userId', eventController.create);
    app.put('/api/event/:userId/:eventId', eventController.update);
    app.delete('/api/event/:userId/:eventId', eventController.delete);
  };
  




  