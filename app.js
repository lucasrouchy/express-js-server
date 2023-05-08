require('dotenv').config()
const express = require('express');
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
// const methodOverride = require('method-override')
const api = require('./api');
const {MONGOOSE_USERNAME, MONGOOSE_PASSWORD, MONGOOSE_DB_NAME} = process.env;
const app = express()
const port = 3000
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
  authSource: 'admin',
  user: MONGOOSE_USERNAME,
  pass: MONGOOSE_PASSWORD
  
};
const dbURL = `mongodb://localhost:27017/${MONGOOSE_DB_NAME}`;
mongoose.connect(dbURL, dbOptions).then(() => {
  console.log('Connected to MongoDB database');
}).catch(err => {
  console.error('Error connecting to MongoDB database', err);
});

// const businessSchema = new mongoose.Schema({
//   ownerid: { required: true },
//   name: { required: true },
//   address: { required: true },
//   city: { required: true },
//   state: { required: true },
//   zip: { required: true },
//   phone: { required: true },
//   category: { required: true },
//   subcategory: { required: true },
//   website: { required: false },
//   email: { required: false }

// });
// const photoSchema = new mongoose.Schema({
//   userid: { required: true },
//   businessid: { required: true },
//   caption: { required: false }
// });
// const reviewSchema = new mongoose.Schema({
//   userid: { required: true },
//   businessid: { required: true },
//   rating: { required: true },
//   review: { required: false }

// });

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
