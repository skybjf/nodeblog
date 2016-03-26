var express = require('express');
var router = express.Router();
var userModel = require('../model/user.js');
var validate = require('../mid/index.js');
var crypto = require('crypto');

/* GET users listing. */
// 注册
router.get('/reg', validate.checkNoLogin, function(req, res) {
    res.render('user/reg');
});

// 提交用户注册表单
router.post('/reg', validate.checkNoLogin, function(req, res) {
    // req.body
    var user = req.body;
    user.avatar = 'https://secure.gravatar.com/avatar/' + md5(user.email);
    // user.password = md5(user.password);
    userModel.create(user, function(err, doc) {
        if (err) {
            req.flash("error", "注册失败了");
            res.redirect('back');
        } else {
            req.session.user = doc;
            req.flash("success", "注册成功了");
            res.redirect('/');
        }
    });
    // res.send('reg');
});

// 登录
router.get('/login', validate.checkNoLogin, function(req, res) {
    res.render('user/login');
});

// 提交用户登录表单
router.post('/login', validate.checkNoLogin, function(req, res) {
    // req.body
    var user = req.body;
    userModel.findOne(user, function(err, doc) {
        if (err) {
            req.flash("error", "登录失败了");
            res.redirect('back');
        } else {
            req.session.user = doc;
            req.flash("success", "登录成功了");
            res.redirect('/');
        }
    });
});

// 退出
router.get('/logout', validate.checkLogin, function(req, res) {
    req.session.user = null;
    res.redirect('/');
});

// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}
