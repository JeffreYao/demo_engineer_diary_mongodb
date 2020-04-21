const mongoose = require('mongoose');
const EngineerLog = require('../engineer_log');

mongoose.connect('mongodb://127.0.0.1/engineerLog', { useNewUrlParser: true });

const db = mongoose.connection;

db.on('error', () => {
  console.log('db error :(');
});

db.once('open', () => {
  console.log('db connected:)');

  for (var i = 0; i < 5; i++) {
    EngineerLog.create({
      workTime: 'name-' + i,
      workDescription: 'workDescription-' + i
    });
  }
  console.log('done!');
});
