const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const {
  userOneId,
  userOne,
  setupDatabase
} = require('./fixtures/db');

beforeEach(setupDatabase);

test('Should sign up a new user', async () => {
  const response = await request(app).post('/users').send({
    name: 'Ronaldo',
    email: 'ronaldo@juv.com',
    password: 'ronaldo@1234'
  }).expect(201);

  const user = User.findById(response.body.user._id);
  expect(user).not.toBeNull();
  expect(response.body).toMatchObject({
    user: {
      name: 'Ronaldo',
      email: 'ronaldo@juv.com',
    },
    // token: user.tokens[0].token
  });
});

test('should login existing user', async () => {
  await request(app).post('/users/login').send({
    email: 'test@gmail.com',
    password: 'test@1234'
  }).expect(200);
});

test('should login existing user', async () => {
  await request(app).post('/users/login').send({
    email: 'test@ggmail.com',
    password: 'ashdgjashd'
  }).expect(400);
});

test('should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test('should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});

test('Should upload avatar imgae', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});