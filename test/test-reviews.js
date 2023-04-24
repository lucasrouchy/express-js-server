const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const Review = require('../models/review');

chai.use(chaiHttp);

describe('Reviews', ()  => {

  // TEST INDEX
  it('should index ALL reviews and businesses on / GET', (done) => {
    chai.request(server)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html;
          done();
        });
  });
  it('should display new form on /reviews/new GET', (done) => {
    chai.request(server)
      .get(`/reviews/new`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.html
          done();
        });
  });
  it('should edit a SINGLE review on /reviews/edit GET', (done) => {
   
    chai.request(server)
      .get(`/reviews/edit`)
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.html
        done();
      });
});


});