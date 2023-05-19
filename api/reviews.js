const mongoose = require('mongoose');
const express = require('express');
const router = require('express').Router();
const jwtMiddleware = require('../jwtMiddleware');
const reviewSchema = require('../models/review');
const rateLimit = require('express-rate-limit');
exports.router = router;

const unAuthenticatedLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Too many requests, please try again later.'
});

const authenticatedLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.user.id,
  message: 'Too many requests, please try again later.'
});

router.get('/', unAuthenticatedLimiter, async (req, res) => {
  try{
    const data = await reviewSchema.find();
    res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

router.get('/:id', unAuthenticatedLimiter, async (req, res) => {
  try{
    const review = await reviewSchema.findById(req.params.id);
    res.json(review)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

router.use(authenticatedLimiter);

router.post('/post', jwtMiddleware, async (req, res) => {
  if (req.body.userid !== req.user.id && !req.user.admin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const review = new reviewSchema({
    _id: new mongoose.Types.ObjectId(),
    id: req.body.id,
    userid: req.body.userid,
    businessid: req.body.businessid,
    dollars: req.body.dollars,
    stars: req.body.stars,
    review: req.body.review
  });
  try{
    const savedReview = review.save();
    res.status(200).json(savedReview);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});


router.patch('/update/:id', jwtMiddleware, async (req, res) => {
  if (req.body.userid !== req.user.id && !req.user.admin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    const result = await reviewSchema.findByIdAndUpdate(
        id, updatedData, options
    )
    res.send(result)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
});
router.delete('/delete/:id', jwtMiddleware, async(req, res) => {
  if (req.body.userid !== req.user.id && !req.user.admin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const id = req.params.id;
    const data = await reviewSchema.findByIdAndDelete(id)
    res.send(`Document with ${data.businessid} has been deleted..`)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
});
