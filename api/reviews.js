const mongoose = require('mongoose');
const express = require('express');
const router = require('express').Router();
// const { validateAgainstSchema, extractValidFields } = require('../val/validation');
const reviewSchema = require('../models/review');
// const reviews = require('../db/reviews');

exports.router = router;
// exports.reviews = reviews;

router.post('/post', async (req, res) => {
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

router.get('/', async (req, res) => {
  try{
    const data = await reviewSchema.find();
    res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

router.get('/:id', async (req, res) => {
  try{
    const review = await reviewSchema.findById(req.params.id);
    res.json(review)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});
router.patch('/update/:id', async (req, res) => {
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
router.delete('/delete/:id', async(req, res) => {
  try {
    const id = req.params.id;
    const data = await reviewSchema.findByIdAndDelete(id)
    res.send(`Document with ${data.businessid} has been deleted..`)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
});
