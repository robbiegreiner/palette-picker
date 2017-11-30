const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should show homepage with text', () => {
    chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.includes('bloom');
    })
    .catch(error => {
      throw error;
    });
  });

  it('should return a 404 if the route does not exsit', () => {
    chai.request(server)
    .get('/sad')
    .then(response => {
      response.should.have.status(404);
    });
  });
});

describe('API Routes', () => {

});
