const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');
const expect = chai.expect;

chai.use(chaiHttp);

describe('API de Sesiones', () => {
  it('debería iniciar sesión de un usuario existente', (hecho) => {
    chai
      .request(app)
      .post('/api/sessions/login')
      .send({ email: 'usuario@ejemplo.com', contraseña: 'contraseñaSegura' })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('token');
        hecho();
      });
  });

  it('no debería iniciar sesión con credenciales incorrectas', (hecho) => {
    chai
      .request(app)
      .post('/api/sessions/login')
      .send({ email: 'usuario@ejemplo.com', contraseña: 'contraseñaIncorrecta' })
      .end((err, res) => {
        expect(res.status).to.equal(401); // Código de estado 401 para no autorizado
        hecho();
      });
  });

  it('debería cerrar sesión de un usuario autenticado', (hecho) => {
    chai
      .request(app)
      .post('/api/sessions/logout')
      .end((err, res) => {
        expect(res.status).to.equal(204); // Código de estado 204 para no contenido
        hecho();
      });
  });
});
