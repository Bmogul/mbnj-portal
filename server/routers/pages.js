const express = require('express');
const app = new express.Router();
const crypto = require('crypto')
const path = require('path')

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
    let roles = req.staff.role
    let tabs = [];
    console.log(roles)
    if(roles.includes('admin')){
        tabs.push('DivCa')
        tabs.push('DivCh')
        tabs.push('DivSa')
        tabs.push('DivSl')
    }
    console.log(tabs)
    res.render('main', {Name: req.staff.name, tabs})
})



module.exports = app;