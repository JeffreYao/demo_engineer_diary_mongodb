const express = require('express');
const router = express.Router();
const User = require('../models/user');
const EngineerLog = require('../models/engineer_log');
const { xlsxDownload } = require('../populate_merge');
const { deleteFile } = require('../func');
const { authenticated } = require('../config/auth');


router.get('/', authenticated, (req, res) => {
  res.send('/engineerLog');
});

router.post('/excel', authenticated, (req, res) => {
  User.findById(req.user._id, (err, logId) => {
    if (err) return console.error(err);


    const year = req.body.year;
    const month = req.body.month;
    const username = logId.name;
    //查詢日誌

    EngineerLog.find({
      userId: req.user._id,
      workDate: { $gte: `${year}-${month}-1 0:0:0`, $lte: `${year}-${month}-31 23:59:59` }
    })
      .sort({ workDate: 1 })
      .exec((err, engineerLog) => {
        if (err) return console.error(err);

        if (engineerLog.length === 0) {
          return res.send("查無資料");
        };
        const formDate = (engineerLog[0].workDate).toISOString().split('T')[0];//'2020-02-14'
        // 原始檔案
        xlsxDownload(engineerLog, username, formDate); //1.寫入檔案
        setTimeout(function () {
          res.download(`./public/${month}月份維護報告與工作日誌_${username}.xlsx`, `${month}月份維護報告與工作日誌_${username}.xlsx`);
        }, 2500);//2.使用者下載檔案

        setTimeout(function () {
          deleteFile(username, month);
        }, 5000);//3.刪除1.產生的檔案
      });
  });
});



router.get('/new', authenticated, (req, res) => {
  res.render('new');
});

router.post('/new', authenticated, (req, res) => {
  console.log(req.body)

  var engineer = new EngineerLog()
  engineer.workDate = req.body.workDate
  engineer.workCategory = req.body.workCategory
  engineer.workDescription = req.body.workDescription
  engineer.userId = req.user._id // 儲存 userId

  engineer.save((err) => {
    if (err) return console.error(err);
    return res.redirect('/');
  });
});



router.get('/:id/edit', authenticated, (req, res) => {
  EngineerLog.findById(req.params.id, (err, logId) => {
    if (err) return console.error(err);
    res.render('edit', { logId });
  });
});

router.put('/:id/edit', authenticated, (req, res) => {
  EngineerLog.findById(req.params.id, (err, logId) => {
    if (err) return console.error(err);
    logId.workDate = req.body.workDate
    logId.workCategory = req.body.workCategory
    logId.workDescription = req.body.workDescription

    logId.save((err) => {
      if (err) return console.error(err);
      return res.redirect('/');
    });
  });
});

router.delete('/:id/delete', authenticated, (req, res) => {
  EngineerLog.findById(req.params.id, (err, logId) => {
    if (err) return console.error(err);
    logId.remove((err) => {
      if (err) return console.error(err);
      return res.redirect('/');
    });
  });
});


module.exports = router
