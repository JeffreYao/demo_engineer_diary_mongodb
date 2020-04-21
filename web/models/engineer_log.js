const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const engineerLogSchema = new Schema({
  workDate: {
    type: Date,
    required: true
  },
  workCategory: {
    type: String,
    required: false
  },
  workDescription: {
    type: String,
    required: false
  },
  createAt: {
    type: Date,
    default: Date.now
  },
  // 加入 userId，建立跟 User 的關聯
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true
  }
});

module.exports = mongoose.model('EngineerLog', engineerLogSchema);