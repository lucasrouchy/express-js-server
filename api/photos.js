const router = require('express').Router();
const { validateAgainstSchema, extractValidFields } = require('../val/validation');
const photoSchema = require('../models/photo');
const photos = require('../db/photos');

exports.router = router;
exports.photos = photos;


router.post('/', function (req, res, next) {
    if (validateAgainstSchema(req.body, photoSchema)) {
      const photo = extractValidFields(req.body, photoSchema);
      photo.id = photos.length;
      photos.push(photo);
      res.status(201).json({
        id: photo.id,
        links: {
          photo: `/photos/${photo.id}`,
          business: `/businesses/${photo.businessid}`
        }
      });
    } else {
      res.status(400).json({
        error: "Request body is not a valid photo object"
      });
    }
});

router.get('/:photoID', function (req, res, next) {
    const photoID = parseInt(req.params.photoID);
    if (photos[photoID]) {
      res.status(200).json(photos[photoID]);
    } else {
      next();
    }
});

router.put('/:photoID', function (req, res, next) {
    const photoID = parseInt(req.params.photoID);
    if (photos[photoID]) {
  
      if (validateAgainstSchema(req.body, photoSchema)) {
       
        const updatedPhoto = extractValidFields(req.body, photoSchema);
        const existingPhoto = photos[photoID];
        if (existingPhoto && updatedPhoto.businessid === existingPhoto.businessid && updatedPhoto.userid === existingPhoto.userid) {
          photos[photoID] = updatedPhoto;
          photos[photoID].id = photoID;
          res.status(200).json({
            links: {
              photo: `/photos/${photoID}`,
              business: `/businesses/${updatedPhoto.businessid}`
            }
          });
        } else {
          res.status(403).json({
            error: "Updated photo cannot modify businessid or userid"
          });
        }
      } else {
        res.status(400).json({
          error: "Request body is not a valid photo object"
        });
      }
  
    } else {
      next();
    }
});

router.delete('/:photoID', function (req, res, next) {
    const photoID = parseInt(req.params.photoID);
    if (photos[photoID]) {
      photos[photoID] = null;
      res.status(204).end();
    } else {
      next();
    }
});
