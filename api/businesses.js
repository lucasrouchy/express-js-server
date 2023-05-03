const router = require('express').Router();
const businesses = require('../db/businesses');
const { reviews } = require('./reviews');
const { photos } = require('./photos');
const { validateAgainstSchema, extractValidFields } = require('../val/validation');

exports.router = router;
exports.businesses = businesses;

const businessSchema = {
    ownerid: { required: true },
    name: { required: true },
    address: { required: true },
    city: { required: true },
    state: { required: true },
    zip: { required: true },
    phone: { required: true },
    category: { required: true },
    subcategory: { required: true },
    website: { required: false },
    email: { required: false }
  };
  

  router.get('/', function (req, res) {

    let page = parseInt(req.query.page) || 1;
    const numPerPage = 10;
    const lastPage = Math.ceil(businesses.length / numPerPage);
    page = page > lastPage ? lastPage : page;
    page = page < 1 ? 1 : page;

    const start = (page - 1) * numPerPage;
    const end = start + numPerPage;
    const pageBusinesses = businesses.slice(start, end);

    const links = {};
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
});

router.post('/', function (req, res, next) {
    if (validateAgainstSchema(req.body, businessSchema)) {
      const business = extractValidFields(req.body, businessSchema);
      business.id = businesses.length;
      businesses.push(business);
      res.status(201).json({
        id: business.id,
        links: {
          business: `/businesses/${business.id}`
        }
      });
    } else {
      res.status(400).json({
        error: "Request body is not a valid business object"
      });
    }
});