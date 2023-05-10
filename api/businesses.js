const mongoose = require('mongoose');
const express = require('express');
const businessSchema = require('../models/business');
const router = require('express').Router();
const businesses = require('../db/businesses');
const { reviews } = require('./reviews');
const { photos } = require('./photos');
const { validateAgainstSchema, extractValidFields } = require('../val/validation');

exports.router = router;
exports.businesses = businesses;


router.get('/', async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const numPerPage = 10;
  const lastPage = Math.ceil(businesses.length / numPerPage);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;

  const start = (page - 1) * numPerPage;
  const end = start + numPerPage;
  const pageBusinesses = businesses.slice(start, end);

  const links = {};
  try{
    const businesses = await businessSchema.find();
    if (page < lastPage) {
      links.nextPage = `/businesses?page=${page + 1}`;
      links.lastPage = `/businesses?page=${lastPage}`;
    }
    if (page > 1) {
      links.prevPage = `/businesses?page=${page - 1}`;
      links.firstPage = '/businesses?page=1';
    }
    res.status(200).json({
      businesses: pageBusinesses,
      pageNumber: page,
      totalPages: lastPage,
      pageSize: numPerPage,
      totalCount: businesses.length,
      links: links
    });
  } catch (err) {
    res.status(500).json({message: "Error getting businesses"})
  }
});
router.get('/:businessID', getBusiness, (req, res) => {
  res.json(req.business);
});
  
 

router.post('/', async (req, res) => {
    if (validateAgainstSchema(req.body, businessSchema)) {
      const business = extractValidFields(req.body, businessSchema);
      
      business.id = businesses.length;
      try{
        const newBusiness = await business.save();
        businesses.push(newBusiness);
        res.status(201).json({id: business.id, links: {business: `/businesses/${business.id}`}});
      } catch (err) {
        res.status(500).json({message: "Error inserting business into DB"})
      }  
    } else {
      res.status(400).json({
        error: "Request body is not a valid business object"
      });
    }
});

router.patch('/:businessID', function (req, res, next) {
    const businessID = parseInt(req.params.businessID);
    if (businesses[businessID]) {
      if (validateAgainstSchema(req.body, businessSchema)) {
        businesses[businessID] = extractValidFields(req.body, businessSchema);
        res.status(200).json({
          links: {
            business: `/businesses/${businessID}`
          }
        });
      } else {
        res.status(400).json({
          error: "Request body is not a valid business object"
        });
      }
    } else {
      next();
    }
});

router.put('/:businessID', getBusiness, async (req, res) => {
  try {
    const updatedBusiness = await res.business.set(req.body);
    res.json(updatedBusiness);
  } catch (err) {
    res.status(400).json({message: err.message});
  }
});

router.delete('/:businessID', getBusiness, async (req, res) => {
  try {
    await res.business.deleteOne();
    res.json({message: "Business deleted"});
  } catch (err) {
    res.status(500).json({message: err.message});
  }
});

async function getBusiness(req, res, next){
  let business;
  try{
    business = await businessSchema.findById(req.params.businessID);
    if (business == null) {
      res.status(404).json({message: "Business not found"});
    }
  } catch (err) {
      return res.status(500).json({message: err.message});
  }
  res.business = business;
  next();

}