const express = require('express')
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
const morgan = require('morgan');
// const methodOverride = require('method-override')
const api = require('./api');

const app = express()
const port = 3000

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
