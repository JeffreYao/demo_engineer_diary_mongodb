const express = require('express');
const router = express.Router();
const EngineerLog = require('../models/engineer_log');


// 載入 auth middleware 裡的 authenticated 方法
const { authenticated } = require('../config/auth')


router.get('/', authenticated, (req, res) => {
  console.log(req.body);

  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(1, '0');
  const yyyy = today.getFullYear();

  const userName = req.user.name;
  EngineerLog.find({
    userId: req.user._id,
    workDate: { $gte: `${yyyy}-${mm}-1 0:0:0`, $lte: `${yyyy}-${mm}-31 23:59:59` }
  })
    .sort({ workDate: 1 })
    .exec((err, log) => {
      if (err) return console.error(err)
      console.log(log)
      return res.render('index', { log, mm, userName, yyyy });
    })
});


router.post('/search', authenticated, (req, res) => {
  console.log(req.body);
  const yyyy = req.body.year;
  const month = req.body.month;
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(1, '0');


  EngineerLog.find({
    userId: req.user._id,
    workDate: { $gte: `${yyyy}-${month}-1 0:0:0`, $lte: `${yyyy}-${month}-31 23:59:59` }
  })
    .sort({ workDate: 1 })
    .exec((err, log) => {
      if (err) return console.error(err)
      console.log(log)
      return res.render('index', { log, mm, yyyy })
    })
});


module.exports = router
