const express = require('express')
// const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const methodOverride = require('method-override')
const { engine } = require('express-handlebars');
const app = express()
const port = 3000



// mongoose.Promise = global.Promise;
// const url = "mongodb://localhost/real-reviews";
// mongoose.connect(url ,{ 

//  useNewUrlParser: true,
//  useUnifiedTopology: true
// })
// const db = mongoose.connection;
// db.once("open", (_) => {
//   console.log("Database connected:", url);
// });

// db.on("error", (err) => {
//   console.error("connection error:", err);
// });

// app.use(methodOverride('_method'))
// app.use(bodyParser.urlencoded({ extended: true }));

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// async function run() {
//   await mongoose.connect('mongodb://localhost:3000');
//   const Review = mongoose.model('Review', {
//     title: String,
//     description: String,
//     restaurantName: String

//   });
//   await mongoose.model('Review').findOne();
// }

const Review = mongoose.model('Review', {
  title: String,
  description: String,
  restaurantName: String
});

let reviews = [
    { title: "Good pasta horrible customer service", restaurantName: "Michaelangel's Mom's pasta", description: "I ordered the pasta a la bolognagnse and was very happy with the taste but our waiter kevin left a bad taste in my mouth." , picture: "http://goodimage.jpeg", caption:"lengthy caption"},
    {title: "Traumitized my kids", restaurantName: "Chuck E Cheese", description: "the animatronics kept messing with my kid almost like there was a human inside. ", picture: "http://goodimage.jpeg", caption:"lengthy caption" },
    {title: "Incredible!", restaurantName: "Le Pigeon", description:"best I ever had!", picture: "http://goodimage.jpeg", caption:"lengthy caption" }
]
let businesses = [
    {name: "Big Dawgs Gotta Eat", description: "Cozy establishment with out of this world dawgs. ", picture: "http://goodimage.jpeg", caption:"lengthy caption" },
    {name: "4theWings", description: "Best wings in town.", picture: "http://goodimage.jpeg", caption:"lengthy caption" }

]




// app.get('/', (req, res) => {
//   Review.find()
//     .then(reviews => {
//       res.render('reviews-index', { reviews: reviews });
//     })
//     .catch(err => {
//       console.log(err);
//     })
// })
app.get('/', (req, res) => {
  res.render('home-index', { reviews: reviews, businesses: businesses });
})
app.get('/reviews/new', (req, res) => {
  res.render('reviews-new', {});
})
app.get('/businesses/new', (req, res) => {
  res.render('businesses-new', {});
})
app.get('/reviews/show', (req, res) => {
  res.render('reviews-show', {reviews: reviews});
})
app.get('/businesses/show', (req, res) => {
  res.render('businesses-show', {businesses:businesses});
})
app.get('/reviews/edit', (req, res) => {
  res.render('reviews-edit', {});
})
app.get('/business/edit', (req, res) => {
  res.render('business-edit', {});
})
// app.get('/', (req, res) => {
//   res.render('reviews-new', {reviews: reviews});
// })


// app.post('/reviews', (req, res) => {
//   Review.create(req.body).then((review) => {
//     console.log(review);
//     res.redirect('/');
//   }).catch((err) => {
//     console.log(err.message);
//   })
// })
// app.get('/reviews/:id', (req, res) => {
//   Review.findById(req.params.id).then((review) => {
//     res.render('reviews-show', { review: review })
//   }).catch((err) => {
//     console.log(err.message);
//   })
// });
// app.get('/reviews/:id/edit', (req, res) => {
//   Review.findById(req.params.id, function(err, review) {
//     res.render('reviews-edit', {review: review});
//   })
// })
// app.delete('/reviews/:id', function (req, res) {
//   console.log("DELETE review")
//   Review.findByIdAndRemove(req.params.id).then((review) => {
//     res.redirect('/');
//   }).catch((err) => {
//     console.log(err.message);
//   })
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
module.exports = app;