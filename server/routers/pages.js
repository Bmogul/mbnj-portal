const express = require('express');
const app = new express.Router();
const crypto = require('crypto')
const { staffAuth, attendanceAuth, headMAuth, adminAuth, committeeAuth } = require('../middleware/staffAuth');

app.get('/login', function(req,res){
    let cPath = './client/public/pages/login.html'
    console.log(path.resolve(cPath))
    res.sendFile(path.resolve(cPath))
})

app.get('/parentLogin', function(req,res){
    let cPath = './client/public/pages/parentlogin.html'
    console.log(path.resolve(cPath))
    res.sendFile(path.resolve(cPath))
})

app.get('/portal', staffAuth, function(req,res){
    console.log(req.staff)
    // res.render('portal', {Name: , tabs:render.GenerateTabs()})
})


module.exports = app;