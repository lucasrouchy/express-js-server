const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
// const { validateAgainstSchema, extractValidFields } = require('../val/validation');
const photoSchema = require('../models/photo');
// const photos = require('../db/photos');

exports.router = router;
// exports.photos = photos;


router.post('/post', async (req, res) => {
  const photo = new photoSchema({
    _id: new mongoose.Types.ObjectId(),
    id: req.body.id,
    userid: req.body.userid,
    businessid: req.body.businessid,
    caption: req.body.caption
  });
  try{
    const savedPhoto = photo.save();
    res.status(200).json(savedPhoto);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
router.get('/', async (req, res) => {
  try{
    const data = await photoSchema.find();
    res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

router.get('/:id', async (req, res) => {
  try{
    const business = await photoSchema.findById(req.params.id);
    res.json(business)
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
    const result = await photoSchema.findByIdAndUpdate(
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
    const data = await photoSchema.findByIdAndDelete(id)
    res.send(`Document with ${data.businessid} has been deleted..`)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
});
