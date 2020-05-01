const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/User');
const Task = require('../../src/models/Task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'test_user',
  email: 'test@gmail.com',
  password: 'test@1234',
  tokens: [{
    token: jwt.sign({
      _id: userOneId
    }, process.env.JWT_SECRET_KEY)
  }]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: 'test_user_2',
  email: 'test2@gmail.com',
  password: 'test@12342',
  tokens: [{
    token: jwt.sign({
      _id: userTwoId
    }, process.env.JWT_SECRET_KEY)
  }]
};

const testTaskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: 'test task 1',
  completed: false,
  owner: userOneId
};

const testTaskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: 'test task 2',
  completed: true,
  owner: userOneId
};

const testTaskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: 'test task 3',
  completed: false,
  owner: userTwoId
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(testTaskOne).save();
  await new Task(testTaskTwo).save();
  await new Task(testTaskThree).save();
};

module.exports = {
  userOneId,
  userTwoId,
  userOne,
  userTwo,
  testTaskOne,
  testTaskTwo,
  testTaskThree,
  setupDatabase
};