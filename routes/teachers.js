var express = require("express")
var router = express.Router()


router.get('/add',function(req,res,next){
    res.render('teachers/add',{title:"学生添加"})
})


router.get('/list',function(req,res,next){
    res.render('teachers/list',{title:"学生添加"})
})


module.exports = router