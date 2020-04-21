const express = require('express')
const router = express.Router()
const EngineerLog = require('../models/engineer_log')


router.get('/', (req, res) => {
  res.send('/api')
})


router.post('/engineerLog', (req, res) => {
  var engineer = new EngineerLog()
  engineer.workDate = req.body.workDate
  engineer.workCategory = req.body.workCategory
  engineer.workDescription = req.body.workDescription
  console.log(req.body)
  engineer.save((err) => {
    if (err) return console.error(err)
    return res.json({ message: "User Created" })
  })
})

//workDate 可以隨機取名稱
router.get('/engineerLog', (req, res) => {
  EngineerLog.find((err, workDate) => {
    if (err) return console.error(err)
    return res.json(workDate)
  })
})

router.get('/engineerLog/:id', (req, res) => {
  EngineerLog.findById(req.params.id, (err, logId) => {
    if (err) return console.error(err)
    return res.json(logId)
  })
})

router.put('/engineerLog/:id', (req, res) => {
  EngineerLog.findById(req.params.id, (err, logId) => {
    if (err) return console.error(err)
    logId.workDate = req.body.workDate
    logId.workCategory = req.body.workCategory
    logId.workDescription = req.body.workDescription

    logId.save((err) => {
      if (err) return console.error(err)
      return res.json({ message: "User Updated" })
    })
  })
})

router.delete('/engineerLog/:id', (req, res) => {
  EngineerLog.findById(req.params.id, (err, logId) => {
    if (err) return console.error(err)
    logId.remove((err) => {
      if (err) return console.error(err)
      return res.json({ message: "User deleted" })
    })
  })
})



module.exports = router