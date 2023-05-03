const router = require('express').Router();
const { validateAgainstSchema, extractValidFields } = require('../val/validation');

const reviews = require('../db/reviews');

exports.router = router;
exports.reviews = reviews;

const reviewSchema = {
    userid: { required: true },
    businessid: { required: true },
    dollars: { required: true },
    stars: { required: true },
    review: { required: false }
};

router.post('/', function (req, res, next) {
    if (validateAgainstSchema(req.body, reviewSchema)) {
      const review = extractValidFields(req.body, reviewSchema);  
      const userReviewedThisBusinessAlready = reviews.some(
        existingReview => existingReview
          && existingReview.ownerid === review.ownerid
          && existingReview.businessid === review.businessid
      );
  
      if (userReviewedThisBusinessAlready) {
        res.status(403).json({
          error: "User has already posted a review of this business"
        });
      } else {
        review.id = reviews.length;
        reviews.push(review);
        res.status(201).json({
          id: review.id,
          links: {
            review: `/reviews/${review.id}`,
            business: `/businesses/${review.businessid}`
          }
        });
      }
  
    } else {
      res.status(400).json({
        error: "Request body is not a valid review object"
      });
    }
});
router.get('/:reviewID', function (req, res, next) {
    const reviewID = parseInt(req.params.reviewID);
    if (reviews[reviewID]) {
      res.status(200).json(reviews[reviewID]);
    } else {
      next();
    }
});

router.put('/:reviewID', function (req, res, next) {
    const reviewID = parseInt(req.params.reviewID);
    if (reviews[reviewID]) {
  
      if (validateAgainstSchema(req.body, reviewSchema)) {
       
        let updatedReview = extractValidFields(req.body, reviewSchema);
        let existingReview = reviews[reviewID];
        if (updatedReview.businessid === existingReview.businessid && updatedReview.userid === existingReview.userid) {
          reviews[reviewID] = updatedReview;
          reviews[reviewID].id = reviewID;
          res.status(200).json({
            links: {
              review: `/reviews/${reviewID}`,
              business: `/businesses/${updatedReview.businessid}`
            }
          });
        } else {
          res.status(403).json({
            error: "Updated review cannot modify businessid or userid"
          });
        }
      } else {
        res.status(400).json({
          error: "Request body is not a valid review object"
        });
      }
  
    } else {
      next();
    }
});

router.delete('/:reviewID', function (req, res, next) {
    const reviewID = parseInt(req.params.reviewID);
    if (reviews[reviewID]) {
      reviews[reviewID] = null;
      res.status(204).end();
    } else {
      next();
    }
});