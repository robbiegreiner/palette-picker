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
        response.body[0].name.should.equal('Beastie Boys');
        response.body[0].project_id.should.equal(1);
        response.body[0].should.have.property('hex1');
        response.body[0].should.have.property('hex2');
        response.body[0].should.have.property('hex3');
        response.body[0].should.have.property('hex4');
        response.body[0].should.have.property('hex5');
        response.body[0].hex1.should.equal('#A7DF45');
        response.body[0].hex2.should.equal('#81A03C');
        response.body[0].hex3.should.equal('#339445');
        response.body[0].hex4.should.equal('#93B26A');
        response.body[0].hex5.should.equal('#E750C6');

        response.body[1].should.have.property('name');
        response.body[1].name.should.equal('Dirty Heads');
        response.body[1].project_id.should.equal(1);
        response.body[1].should.have.property('hex1');
        response.body[1].should.have.property('hex2');
        response.body[1].should.have.property('hex3');
        response.body[1].should.have.property('hex4');
        response.body[1].should.have.property('hex5');
        response.body[1].hex1.should.equal('#769DA3');
        response.body[1].hex2.should.equal('#5CF36D');
        response.body[1].hex3.should.equal('#2236DA');
        response.body[1].hex4.should.equal('#DBA028');
        response.body[1].hex5.should.equal('#BC601A');
        done();
      })
      .catch(error => {
        throw error;
      });
    });
  });

  describe('GET /api/v1/projects/:id/palettes', () => {
    it('should get a project\'s palettes from database', (done) => {
      chai.request(server)
      .get('/api/v1/projects/1/palettes')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Beastie Boys');
        response.body[0].project_id.should.equal(1);
        response.body[0].should.have.property('hex1');
        response.body[0].should.have.property('hex2');
        response.body[0].should.have.property('hex3');
        response.body[0].should.have.property('hex4');
        response.body[0].should.have.property('hex5');
        response.body[0].hex1.should.equal('#A7DF45');
        response.body[0].hex2.should.equal('#81A03C');
        response.body[0].hex3.should.equal('#339445');
        response.body[0].hex4.should.equal('#93B26A');
        response.body[0].hex5.should.equal('#E750C6');

        response.body[1].should.have.property('name');
        response.body[1].name.should.equal('Dirty Heads');
        response.body[1].project_id.should.equal(1);
        response.body[1].should.have.property('hex1');
        response.body[1].should.have.property('hex2');
        response.body[1].should.have.property('hex3');
        response.body[1].should.have.property('hex4');
        response.body[1].should.have.property('hex5');
        response.body[1].hex1.should.equal('#769DA3');
        response.body[1].hex2.should.equal('#5CF36D');
        response.body[1].hex3.should.equal('#2236DA');
        response.body[1].hex4.should.equal('#DBA028');
        response.body[1].hex5.should.equal('#BC601A');
        done();
      })
      .catch(error => {
        throw error;
      });
    });

    it('should return status 500 if project does not exist', (done) => {
      chai.request(server)
      .get('/api/v1/projects/*/palettes')
      .then(response => {
        response.should.have.status(500);
        done();
      })
      .catch(error => {
        throw error;
      });
    });
  });

  describe('POST /api/v1/projects/', () => {
    it('should add a new project in the database', (done) => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
        id: 3,
        name: 'Voldemort\'s New Blog'
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(3);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Voldemort\'s New Blog')

        chai.request(server)
        .get('/api/v1/projects')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          done();
        })
        .catch(error => {
          throw error;
        });
      });
    });
  });

  describe('POST /api/v1/projects/', () => {
    it('should add a new palette in the database', (done) => {
      chai.request(server)
      .post('/api/v1/palettes')
      .send({
        id: 3,
        name: 'Modest Mouse',
        hex1: '#A9E9D2',
        hex2: '#9C5553',
        hex3: '#BB10A0',
        hex4: '#36DE11',
        hex5: '#FDB53F',
        project_id: 1
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].id.should.equal(3);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Modest Mouse')

        chai.request(server)
        .get('/api/v1/projects/1/palettes')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[2].should.have.property('name');
          response.body[2].name.should.equal('Modest Mouse');
          response.body[2].project_id.should.equal(1);
          response.body[2].should.have.property('hex1');
          response.body[2].should.have.property('hex2');
          response.body[2].should.have.property('hex3');
          response.body[2].should.have.property('hex4');
          response.body[2].should.have.property('hex5');
          response.body[2].hex1.should.equal('#A9E9D2');
          response.body[2].hex2.should.equal('#9C5553');
          response.body[2].hex3.should.equal('#BB10A0');
          response.body[2].hex4.should.equal('#36DE11');
          response.body[2].hex5.should.equal('#FDB53F');
          done();
        })
        .catch(error => {
          throw error;
        });
      });
    });
  });







});//end of api routes
