const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

let authToken = '';  // Variable global para el token
let verificationCode = ''; // Variable global para el código de verificación
let clientId = '';  // Variable global para el ID del cliente

beforeAll(async () => {
  // Conexión a la base de datos
  await mongoose.connect(process.env.MONGODB_URI);

  // Limpiar la base de datos antes de comenzar los tests
  await User.deleteMany({});  // Borra todos los usuarios
});

afterAll(async () => {
  // Cerrar la conexión con la base de datos después de todos los tests
  await mongoose.connection.close();
});

describe('POST /api/user/register', () => {
  it('Deberia crear un usuario nuevo del que obtener el codigo de verificacion y el token', async () => {
    const userData = {
      name: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    };

    const response = await request(app).post('/api/user/register').send(userData);

    // Verificación de la respuesta
    expect(response.status).toBe(201); 
    expect(response.body.token).toBeDefined();

    // Guardar los datos en variables globales
    authToken = response.body.token;

    // Obtener el usuario registrado de la base de datos y extraer el código
    const user = await User.findOne({ email: userData.email });
    verificationCode = user.validationCode;
  });
});

describe('POST /api/user/login', () => {
    it('Deberia conseguir iniciar sesion con dicho token generado', async () => {
      const loginData = {
        email: 'testuser@example.com',
        password: 'password123',
      };
  
      const response = await request(app)
        .post('/api/user/login')
        .set('Authorization', `Bearer ${authToken}`) // Se añade el token en el header Authorization
        .send(loginData);  // Enviamos email y password en el body
  
      // Verificación de la respuesta
      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();  // Aseguramos que nos devuelvan un nuevo token
    });
  });

  describe('PUT /api/user/validation', () => {
    it('Deberia de validar el correo electronico con el codigo de verificacion generado', async () => {
      // Asegúrate de tener el código de verificación del paso anterior
      expect(verificationCode).toBeDefined();  // Verifica que tienes un código de verificación
  
      const validationData = {
        code: verificationCode,  // Usamos el código recibido en el registro
      };
  
      const response = await request(app)
        .put('/api/user/validation')
        .set('Authorization', `Bearer ${authToken}`) // Añadimos el token en el encabezado Authorization
        .send(validationData);  // Enviamos el código en el cuerpo
  
      // Verificación de la respuesta
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Correo validado correctamente');  // Este mensaje debe ser el que tu backend devuelve cuando la validación es exitosa
    });
  });


describe('PATCH /api/user/', () => {
    it('Deberia de modificar los datos del usuario creado', async () => {
      const profileData = {
        fullName: 'Test User',
        phone: '1234567890',
        address: 'Test Address'
      };
  
      const response = await request(app)
        .patch('/api/user/')
        .set('Authorization', `Bearer ${authToken}`) // Se añade el token en el header Authorization
        .send(profileData);  // Enviamos email y password en el body
  
      // Verificación de la respuesta
      expect(response.status).toBe(200);
      expect(response.body.profile.fullName).toBe('Test User');
      expect(response.body.profile.phone).toBe('1234567890');
      expect(response.body.profile.address).toBe('Test Address');
    });
  });

  describe('PATCH /api/user/company', () => {
    it('Deberia de modificar los datos de la compañia del usuario', async () => {
      const companyData = {
        name: 'Test Company',
        address: 'Company Address',
        phone: '1234567890'
      };
  
      const response = await request(app)
        .patch('/api/user/company')
        .set('Authorization', `Bearer ${authToken}`) // Se añade el token en el header Authorization
        .send(companyData);  // Enviamos email y password en el body
  
      // Verificación de la respuesta
      expect(response.status).toBe(200);
      expect(response.body.company.name).toBe('Test Company');
      expect(response.body.company.address).toBe('Company Address');
      expect(response.body.company.phone).toBe('1234567890');
    });
  });

  describe('POST /api/client/', () => {
    it('Deberia crear un cliente en el usuario logueado', async () => {
      const clientData = {
        name: 'Test Client',
        email: 'testClient8@example.com',
        phone: '1234567890',
        address: 'Client Address',
      };
  
      const response = await request(app)
        .post('/api/client/')
        .set('Authorization', `Bearer ${authToken}`) // Se añade el token en el header Authorization
        .send(clientData);  // Enviamos email y password en el body
  
      // Verificación de la respuesta
      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test Client');
      expect(response.body.email).toBe('testClient8@example.com');
      expect(response.body.phone).toBe('1234567890');
      expect(response.body.address).toBe('Client Address');

      clientId = response.body._id;  // Guardamos el ID del cliente creado
    });
  });

  describe('GET /api/client/', () => {
    it('Deberia obtener todos los clientes', async () => {
      const response = await request(app)
        .get('/api/client/')
        .set('Authorization', `Bearer ${authToken}`) // Se añade el token en el header Authorization
  
      // Verificación de la respuesta
      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/client/_id', () => {
    it('Deberia obtener el cliente por su _id', async () => {
      const response = await request(app)
        .get(`/api/client/${clientId}`)
        .set('Authorization', `Bearer ${authToken}`) // Se añade el token en el header Authorization
  
      // Verificación de la respuesta
      expect(response.status).toBe(200);
    });
  });