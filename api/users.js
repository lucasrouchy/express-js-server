const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
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
  try{
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const newUser = await User.findOne({ email });
    if (!newUser) {
      return res.status(400).json({ message: 'Invalid email' });
    }
    const passwordMatch = await bcrypt.compare(password, newUser.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      userid: req.body.id,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      admin: req.body.admin
    });
    const token = jwt.sign(User, JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });

    const savedUser = user.save();
    res.status(200).json(savedUser);
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.use(authenticatedLimiter);

router.post('/login', jwtMiddleware, async (req, res) => {
  const { email, password } = req.body;
  try{
    const user = await User.findOne({ email });
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
    const data = await User.find();
    res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

router.get('/:id/businesses',jwtMiddleware, async (req, res) => {
  try{
    const userid = await User.findById(req.params.userid);
    const userBusinesses = await Business.find({ownerid: userid.userid});
    res.status(200).json({businesses: userBusinesses});
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

router.get('/:id/reviews', jwtMiddleware, async (req, res) => {
  try{
    const userid = await User.findById(req.params.userid);
    const userReviews = await Review.find({userid: userid.userid});
    res.status(200).json({reviews: userReviews});
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

router.get('/:id/photos', jwtMiddleware, async (req, res) => {
  try{
    const userid = await User.findById(req.params.userid);
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
    const user = await User.findById(userid).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

  