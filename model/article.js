var mongoose=require('mongoose');

// var db=mongoose.connect('mongodb://123.57.143.189:27017/bjf');
// 定义模型
var articleSchema=new mongoose.Schema({
	title:String,
	content:String,
	img:String,
	user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
	createAt:{type:Date,defult:Date.now},

});
// 再定义model
var articleModel=mongoose.model('article',articleSchema);
module.exports=articleModel;


