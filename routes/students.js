var express = require("express")
var router = express.Router()

router.get('/add',function(req,res,next){
    res.render('students/add',{title:"学生添加"})
})


router.get('/list',function(req,res,next){
    res.render('students/list',{title:'学生列表'})
})



module.exports = router