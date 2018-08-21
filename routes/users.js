var express = require('express');
var router = express.Router();
var pool = require('../modules/db.js');
var md5 = require("md5");

/* GET users listing. */
router.get('/login', function (req, res, next) {
  res.render('login', {
    title: "登录"
  })
});

router.post('/login', function (req, res, next) {
  var loginName = req.body.loginName
  var password = req.body.password
  var type = req.body.type
  var remember = req.body.remember
  if (!loginName || !password) {
    res.json({
      code: 201,
      message: "账号或密码不能为空!"
    })
    return;
  }


  pool.query('select * from `users` where loginName = ? AND password = ? AND type = ?',[loginName,md5(password),type],function(err,result){
    var user = result[0]
    if(err){
      res.json({
        code:202,
        message:"数据库操作失败"
      })
      return;
    }
    
    if(result.length == 0){
      res.json({
        code:203,
        message:"账号或密码有误或选择错误!"
      })
      return;
    }
    
    if(result.length > 1){
      res.json({
        code:204,
        message:"账号存在异常"
      })
      return;
    }

    if(user.status != 0){
      res.json({
        code:205,
        message:"账号被删除"
      })
      return;
    }

    delete user.password;
    req.session.user = user
    req.session.save();
    res.cookie("user",user)

    if(remember == 'true'){
      res.cookie('loginName',user.loginName)
    }
    else{
      res.clearCookie('loginName')
    }


    if(result.length == 1){
      res.json({
        code:200,
        message:"成功"
      })




    }
  })

})


router.post('/logout',function(req,res,next){
  //以下是服务端渲染。利用ajax是客户端渲染
  //清空cookie和session
  req.session.user = null;
  res.clearCookie('user')

  res.json({
    code:200,
    message:"success"
  })


  // res.render('login',{title:"登录"})
  //方法1，直接跳转login.ejs，缺点是代码和router.ger(/login)接口重复，并且在url上显示的是logout
  // res.redirect('/login')
  //方法2,解决了方法1的2个缺点，推荐使用


  
})




module.exports = router;
