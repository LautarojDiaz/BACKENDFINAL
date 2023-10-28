const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); 
const should = chai.should();

chai.use(chaiHttp);

describe('Cart API', () => {
  it('Deberia conseguir todos los carritos', (done) => {
    chai
      .request(app)
      .get('/carts')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });

  it('Deberia crear nuevo carrito', (done) => {
    chai
      .request(app)
      .post('/carts')
      .send({ userId: 1 }) 
      .end((err, res) => {
        res.should.have.status(201);
        done();
      });
  });
});
