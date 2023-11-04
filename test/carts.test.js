const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const should = chai.should();

chai.use(chaiHttp);

describe('Cart API', () => {
  it('Debería conseguir todos los carritos', (done) => {
    chai
      .request(app)
      .get('/api/carts') 
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });

  it('Debería crear un nuevo carrito', (done) => {
    chai
      .request(app)
      .post('/api/carts') 
      .send({ userId: 1 }) 
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
});
