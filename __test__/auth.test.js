    const request = require('supertest');
const app = require('../app');
const { sequelize, User } = require('../models');

beforeAll(async () => {
  await sequelize.sync({ force: true }); 
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth Endpoints', () => {
  it('Harus bisa mendaftarkan user baru', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        name: 'Test User',
        email: 'test@mail.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('userId');
  });

  it('Harus bisa login dengan user yang sudah terdaftar', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'test@mail.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});