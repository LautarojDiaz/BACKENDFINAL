const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); 
const expect = chai.expect; 

chai.use(chaiHttp);

describe('Products API', () => {
  it('Deberia recibir todo el producto', (done) => {
    chai
      .request(app)
      .get('/products')
      .end((err, res) => {
        expect(res).to.have.status(200); 
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('Deberia añadir un nuevo producto', (done) => {
    chai
      .request(app)
      .post('/products')
      .send({ name: 'Product 1', price: 10.0 })
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });
});
