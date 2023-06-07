const express = require('express');
const mongoose = require('mongoose');
const router = require('express').Router();
const multer = require('multer');
const gridfs = require('gridfs-stream');
const crypto = require('crypto');
const amqp = require('amqplib');
const photoSchema = require('../models/photo');
const jwtMiddleware = require('../jwtMiddleware');
const rateLimit = require('express-rate-limit');
exports.router = router;

const rabbitmqURL = 'amqp://localhost';
const thumbnailQueue = 'thumbnailQueue';

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only JPEG and PNG is allowed!'));
    }
  }
})
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

async function connectToRabbitMQ() {
  try {
    const connection = await amqp.connect(rabbitmqURL);
    const channel = await connection.createChannel();

    await channel.assertQueue(thumbnailQueue, { durable: true });
    console.log('Connected to RabbitMQ');
    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ', error);
  }
}
const rabbitMQchannel = await connectToRabbitMQ();

router.get('/', unAuthenticatedLimiter, async (req, res) => {
  try{
    const data = await photoSchema.find();
    res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message});
  }
});

router.get('/:id', unAuthenticatedLimiter, async (req, res) => {
  try{
    const photoId = req.params.id;

    const photo = await photoSchema.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    const file = await gfs.files.findOne({ _id: photo.fileid });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const downloadURL = `/media/photos/${photoId}.${photo.format}`;
    res.json({ ...photo.toObject(), downloadURL });
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
});

router.use(authenticatedLimiter);

router.post('/post', jwtMiddleware, upload.single('file'), async (req, res) => {
  if (req.body.userid !== req.user.id && !req.user.admin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  
  const photo = new photoSchema({
    _id: new mongoose.Types.ObjectId(),
    id: req.body.id,
    userid: req.body.userid,
    businessid: req.body.businessid,
    caption: req.body.caption,
    format: req.file.mimetype.split('/')[1]
  });
  try{
    const buffer = req.file.buffer;
    
    const writestream = gfs.createWriteStream({
      filename: photo._id.toString(),
      root: 'photos',
      contentType: req.file.mimetype
    });
    writestream.write(buffer);
    writestream.end();
    writestream.on('finish', async () => {
      console.log(`Photo with ID ${photo._id} stored in GridFS`);
      const savedPhoto = await photo.save();
      const channel = await rabbitMQchannel;
      const message = JSON.stringify({ photoID: savedPhoto._id });
      channel.sendToQueue(thumbnailQueue, Buffer.from(message));
      res.status(200).json(savedPhoto);
    });
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
    const result = await photoSchema.findByIdAndUpdate(
        id, updatedData, options
    );
    res.send(result);
  }
  catch (error) {
      res.status(400).json({ message: error.message });
  }
});
router.delete('/delete/:id', jwtMiddleware, async(req, res) => {
  if (req.body.userid !== req.user.id && !req.user.admin) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  try {
    const id = req.params.id;
    const data = await photoSchema.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    const fileid = data.fileid;
    gfs.remove({ _id: fileid, root: 'photos' }, (err) => {
      if (err) {
        res.status(400).json({ message: err.message });
      } else {
        res.send(`Document with ${data.businessid} has been deleted.`)
      }
    });
  }
  catch (error) {
      res.status(400).json({ message: error.message })
  }
});
