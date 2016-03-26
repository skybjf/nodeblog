var express = require('express');
var router = express.Router();
var articleModel = require('../model/article.js');
// var validate = require('../mid/index.js');
var multer = require('multer');
//指定文件元素的存储方式
var storage = multer.diskStorage({
    //保存文件的路径
    destination: function (req, file, cb) {
        cb(null, '../public/images')
    },
    //指定保存的文件名
    filename: function (req, file, cb) {
        console.error(file);
        cb(null, Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1))
    }
})

/* GET users listing. */
// 请求空白发表文章页面
router.get('/add', function(req, res) {
    res.render('article/add');
});

// 提交文章数据
router.post('/add', function(req, res) {
    var article = req.body;
    var user= req.session.user;
    article.user=user;
    articleModel.create(article, function(err, doc) {
        if (err) {
            req.flash("error", "注册失败了");
            res.redirect('back');
        } else {
            req.session.user = doc;
            req.flash("success", "注册成功了");
            res.redirect('/');
        }
    });
});

router.get('/detail/:_id',function(req,res){
    articleModel.findById(req.params._id,function(err,article){
        res.render('article/detail',{article:article});
    });
});

//删除此文章
router.get('/delete/:_id',function(req,res){
    articleModel.remove({_id:req.params._id},function(err,result){
        if(err){
            req.flash('error','删除失败');
            res.redirect('back');
        }else{
            req.flash('success','删除成功');
            res.redirect('/');
        }
    });
});

router.get('/update/:_id',function(req,res){
    articleModel.findById(req.params._id,function(err,article){
        res.render('article/add',{article:article});
    });
});

var upload = multer({ storage: storage })
router.post('/add',upload.single('img'),function(req,res){
   var article = req.body;
   var _id = article._id;
   if(_id){//有值是表示修改
       //set要更新字段
       var set = {title:article.title,content:article.content};
       if(req.file){//如果新上传了文件，那么更新img字段
           set.img = '/images/'+req.file.filename;
       }
       articleModel.update({_id:_id},{$set:set},function(err,article){
           if(err){
               req.flash('error','更新文章失败');
               return res.redirect('back');
           }else{
               req.flash('success','更新文章成功');
               return res.redirect('/');
           }
       });
   }else{
       if(req.file){//如果新上传了文件，那么更新img字段
           article.img = '/images/'+req.file.filename;
       }
       var user =  req.session.user;
       article.user = user;//user是个对象，但保存进数据库里的是个ID字符串
       articleModel.create(article,function(err,article){
           if(err){
               req.flash('error','发表文章失败');
               return res.redirect('back');
           }else{
               req.flash('success','发表文章成功');
               return res.redirect('/');
           }
       });
   }
});
module.exports = router;
