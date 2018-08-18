function checkLogin(req,res,next){
    if(!(req.session && req.session.user)){
        res.render('login',{title:"登录"})
    }

    
    next()
}






module.exports = checkLogin