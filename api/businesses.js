const mongoose = require('mongoose');
const express = require('express');
const businessSchema = require('../models/business');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('../jwtMiddleware');
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
    const data = await businessSchema.find();
    res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

router.get('/:id', unAuthenticatedLimiter, async (req, res) => {
  try{
    const business = await businessSchema.findById(req.params.id);
    res.json(business)
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
    const savedBusiness = await business.save();
    res.status(200).json(savedBusiness);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.patch('/update/:id',jwtMiddleware, async (req, res) => {
  if (req.body.userid !== req.user.id && !req.user.admin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
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
router.delete('/delete/:id', jwtMiddleware, async(req, res) => {
  if (req.body.userid !== req.user.id && !req.user.admin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const id = req.params.id;
    const data = await businessSchema.findByIdAndDelete(id)
    res.send(`Document with ${data.name} has been deleted..`)
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
});

