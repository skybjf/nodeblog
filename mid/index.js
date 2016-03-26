exports.checkLogin = function(req,res,next){
   if(req.session.user){
       next();
   }else{
       req.flash('error','未登陆');
       res.redirect('/users/login');
   }
}
exports.checkNoLogin = function(req,res,next){
    if(req.session.user){
        req.flash('error','已登陆');
        res.redirect('/');
    }else{
        next();
    }
}