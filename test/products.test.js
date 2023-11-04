const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('API de Productos', () => {
  it('debería obtener una lista de productos', (hecho) => {
    chai
      .request(app)
      .get('/api/products')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        hecho();
      });
  });

  it('debería crear un nuevo producto', (hecho) => {
    chai
      .request(app)
      .post('/api/products')
      .send({ nombre: 'Nombre del Producto', precio: 10.0 })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        hecho();
      });
  });

  it('no debería crear un producto con datos no válidos', (hecho) => {
    chai
      .request(app)
      .post('/api/products')
      .send({ precio: 'inválido' })
      .end((err, res) => {
        expect(res.status).to.equal(400);
        hecho();
      });
  });
});
