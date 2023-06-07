const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userSchema = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const jwtMiddleware = require('../jwtMiddleware');
const { JWT_SECRET, JWT_EXPIRATION_TIME } = require('../config');
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

router.post('/post', unAuthenticatedLimiter, async (req, res) => {
  // const salt = await bcrypt.genSalt(10);
  // const hashedPassword = await bcrypt.hash(req.body.password, salt);
  const user = new userSchema({
    _id: new mongoose.Types.ObjectId(),
    userid: req.body.userid,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    admin: req.body.admin
  });
  try{
    const { email, password } = req.body;
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'user already exists' });
    }
    
    // const token = jwt.sign(userSchema, JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });

    const savedUser = await user.save();
    res.status(200).json(savedUser);
    // res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.use(authenticatedLimiter);

router.post('/login', jwtMiddleware, async (req, res) => {
  const { email, password } = req.body;
  try{
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});


router.get('/', jwtMiddleware, async (req, res) => {
  try{
    const data = await userSchema.find();
    res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

router.get('/:id/businesses',jwtMiddleware, async (req, res) => {
  try{
    const userid = await userSchema.findById(req.params.userid);
    const userBusinesses = await Business.find({ownerid: userid.userid});
    res.status(200).json({businesses: userBusinesses});
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

router.get('/:id/reviews', jwtMiddleware, async (req, res) => {
  try{
    const userid = await userSchema.findById(req.params.userid);
    const userReviews = await Review.find({userid: userid.userid});
    res.status(200).json({reviews: userReviews});
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

router.get('/:id/photos', jwtMiddleware, async (req, res) => {
  try{
    const userid = await userSchema.findById(req.params.userid);
    const userPhotos = await Photo.find({userid: userid.userid});
    res.status(200).json({photos: userPhotos});
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

router.get('/:id', jwtMiddleware, async (req, res) => {
  try{
    const userid = req.params.userid;
    const user = await userSchema.findById(userid).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'userSchema not found' });
    }
    res.json(user)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

  