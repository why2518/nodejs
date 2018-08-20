function checkLogin(req,res,next){
    if(!(req.session && req.session.user)){
        if(!res.cookie('users')){
            res.render('login',{title:"登录"})
            return;
        }
    }

    
    next()
}






module.exports = checkLogin