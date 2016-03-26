var mongoose=require('mongoose');

// var db=mongoose.connect('mongodb://123.57.143.189:27017/bjf');
// 定义模型
var userSchema=new mongoose.Schema({
	username:String,
	password:String,
	eamil:String,
	avatar: String
});
// 再定义model
var userModel=mongoose.model('user',userSchema);
module.exports=userModel;


