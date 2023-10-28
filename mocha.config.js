module.exports = {
  require: 'chai/register-should',
  spec: ['./test/carTests.js', './test/productTest.js'],
  timeout: 10000,
};


  /* No me funciona, en la terminal me da el error "Cannot overwrite Cart model once compiled" 
    Luego lo veo bien, hoy tengo un vuelo a España, no podre entrar a clases. 
    Lo siento mucho, te mando un abrazo */