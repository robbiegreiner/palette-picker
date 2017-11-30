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
  before((done) => {
    database.migrate.latest()
    .then( () => done())
    .catch(error => {
      throw error;
    });
  });

  beforeEach((done) => {
    database.seed.run()
    .then(() => done())
    .catch(error => {
      throw error;
    });
  });

  describe('GET /api/v1/projects', () => {
    it('should get projects from database', (done) => {
      chai.request(server)
      .get('/api/v1/projects')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('idea box');
        done();
      })
      .catch(error => {
        throw error;
      });
    });

    it('should return 404 for a bad URL', (done) => {
      chai.request(server)
      .get('/api/v1/sad')
      .then(response => {
        response.should.have.status(404);
        done();
      });
    });
  });

  describe('GET /api/v1/palettes', () => {
    it('should get palettes from database', (done) => {
      chai.request(server)
      .get('/api/v1/palettes')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('name');
        response.body[0].project_id.should.equal(1);
        response.body[0].should.have.property('hex1');
        done();
      })
      .catch(error => {
        throw error;
      });
    });
  });

});
