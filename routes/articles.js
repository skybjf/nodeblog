var express = require('express');
var articleModel = require('../model/article.js');
var router = express.Router();
var multer = require('multer');

//指定文件元素的存储方式
var storage = multer.diskStorage({
    //保存文件的路径
    destination: function(req, file, cb) {
        cb(null, '../public/images')
    },
    //指定保存的文件名
    filename: function(req, file, cb) {
        console.error(file);
        console.error(Date.now() + '.' + file.mimetype.slice(file.mimetype.indexOf('/') + 1));
        cb(null, Date.now() + '.' + file.mimetype.slice(file.mimetype.indexOf('/') + 1));
        console.error(file.filename);
    }
});
var upload = multer({ storage: storage });

/* GET users listing. */
// 请求空白发表文章页面
router.get('/add', function(req, res) {
    res.render('article/add', { article: {} });
});

// 提交文章数据
router.post('/add', upload.single('img'), function(req, res) {
    // console.log(req.file.filename);
    var article = req.body;
    var _id = article._id;

    if (_id) {
        var set = { title: article.title, content: article.content };
        if (req.file) {
            // console.log(req.file);
            set.img = '/images/' + req.file.filename;
        }
        articleModel.update({ _id: _id }, { $set: set }, function(err, doc) {
            if (err) {
                req.flash("error", "更新失败了");
                return res.redirect('back');
            } else {
                req.flash("success", "更新成功了");
                return res.redirect('/');
            }
        })


    } else {
        if (req.file) {
            // console.log(req.file);
            article.img = '/images/' + req.file.filename;
        }
        var user = req.session.user;
        article.user = user;
        articleModel.create(article, function(err, doc) {
            if (err) {
                req.flash("error", "发表失败了");
                return res.redirect('back');
            } else {
                req.flash("success", "发表成功了");
                res.redirect('/');
            }
        });
    }

});

router.get('/detail/:_id', function(req, res) {
    articleModel.findById(req.params._id, function(err, article) {
        res.render('article/detail', { article: article });
    });
});

//删除此文章
router.get('/delete/:_id', function(req, res) {
    articleModel.remove({ _id: req.params._id }, function(err, result) {
        if (err) {
            req.flash('error', '删除失败');
            res.redirect('back');
        } else {
            req.flash('success', '删除成功');
            res.redirect('/');
        }
    });
});

router.get('/update/:_id', function(req, res) {
    articleModel.findById(req.params._id, function(err, article) {
        res.render('article/add', { article: article });
    });
});

module.exports = router;
