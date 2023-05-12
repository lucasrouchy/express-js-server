const mongoose = require('mongoose');
const express = require('express');
const businessSchema = require('../models/business');
const router = require('express').Router();
// const businesses = require('../db/businesses');
// const { reviews } = require('./reviews');
// const { photos } = require('./photos');
// const { validateAgainstSchema, extractValidFields } = require('../val/validation');

exports.router = router;
// exports.businesses = businesses;

router.post('/post', async (req, res) => {
  const business = new businessSchema({
    _id: new mongoose.Types.ObjectId(),
    id: req.body.id,
    ownerid: req.body.ownerid,
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    phone: req.body.phone,
    category: req.body.category,
    subcategory: req.body.subcategory,
    website: req.body.website,
    email: req.body.email
  });
  try{
    const savedBusiness = business.save();
    res.status(200).json(savedBusiness);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});
router.get('/', async (req, res) => {
  try{
    const data = await businessSchema.find();
    res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

router.get('/:id', async (req, res) => {
  try{
    const business = await businessSchema.findById(req.params.id);
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

    const result = await businessSchema.findByIdAndUpdate(
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
    const data = await businessSchema.findByIdAndDelete(id)
    res.send(`Document with ${data.name} has been deleted..`)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
});

