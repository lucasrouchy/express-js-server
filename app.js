require('dotenv').config()
const express = require('express');
// const bodyParser = require('body-parser');
// const methodOverride = require('method-override')
const mongoose = require('mongoose');
const morgan = require('morgan');
const api = require('./api');
// const Business = require("./models/business");
// const businessesRoutes = require("./api/businesses");
// const reviewsRoutes = require("./api/reviews");
// const usersRoutes = require("./api/users");
const {MONGOOSE_USERNAME, MONGOOSE_PASSWORD, MONGOOSE_DB_NAME} = process.env;

const port = 3000
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
};
const dbURL = `mongodb+srv://lucasrouchy1:guest@cluster0.cw6yjly.mongodb.net/MyResourcesDB`;
mongoose.connect(dbURL, dbOptions).then(() => {
  console.log('Connected to MongoDB database');
}).catch(err => {
  console.error('Error connecting to MongoDB database', err);
});

const app = express()
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static('public'));
app.use('/', api);  

app.use('*', function (req, res, next) {
  res.status(404).json({
    error: "Requested resource " + req.originalUrl + " does not exist"
  });
});

app.use('*', function (err, req, res, next) {
  console.error("== Error:", err)
  res.status(500).send({
      err: "Server error.  Please try again later."
  })
})

app.listen(port, function() {
  console.log("== Server is running on port", port);
});
