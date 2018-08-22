var express = require("express")
var router = express.Router()
var pool = require('../modules/db.js');
var md5 = require('md5');
var checkLogin = require('../modules/checkLogin.js');

router.get('/add', checkLogin, function (req, res, next) {
    var sql = `
    SELECT * FROM majors WHERE status = 0 ;
    SELECT * FROM classes WHERE status = 0;
    SELECT * FROM departments WHERE status = 0;
    `
    pool.query(sql, function (err, result) {
        if (err) {
            res: json({
                code: 201,
                message: "操作异常"
            })
            return;
        }
        var majors = result[0]
        var classes = result[1]
        var departs = result[2]
        res.render('students/add', { title: "学生添加", majors, classes, departs })
    })
})




router.post('/add', checkLogin, function (req, res, next) {
    var sno = req.body.sno;
    var name = req.body.name;
    var sex = req.body.sex;
    var birthday = req.body.birthday;
    var card = req.body.card;
    var majorId = req.body.majorId;
    var classId = req.body.classId;
    var departId = req.body.departId;
    var nativePlace = req.body.nativePlace;
    var address = req.body.address;
    var qq = req.body.qq;
    var phone = req.body.phone;
    var email = req.body.email;
    // 1. 服务器端判断是否为空
    if (!sno || !name || !birthday || !card) {
        res.json({
            code: 201,
            message: '学号，姓名，生日，身份证不能为空'
        })
        return;
    }

    // 2.验证数据库中是否已有sno
    var sql = `SELECT * FROM students WHERE sno = ?`
    pool.query(sql, [sno], function (err, result) {
        if (err) {
            res.json({
                code: 202,
                message: "数据库操作失败"
            })
            return;
        }

        if (result.length > 0) {
            res.json({
                code: 203,
                message: "该学生已注册"
            })
            return;
        }
        // 3. 向user和student表插入数据
        var sql = `INSERT INTO students(sno,name,sex,birthday,card,majorId,classId,departId,nativePlace,address,qq,phone,email,status,createTime,createUserId)VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        var data = [sno, name, sex, birthday, card, majorId, classId, departId, nativePlace, address, qq, phone, email, 0, new Date(), req.session.user.id];
        pool.query(sql, data, function (err, result) {
            if (err) {
                res.json({ code: 203, message: err });
                return;
            }

            pool.query("INSERT INTO users(loginName, password, type, status)VALUE(?,?,?,?)", [name, md5('123456'), 2, 0], function (err, result2) {
                if (err) {
                    res.json({ code: 202, message: "数据库操作异常202！" });
                    return;
                }

                res.json({ code: 200, message: '保存成功！' })
            })
        })
    })

})


router.get('/list', checkLogin, function (req, res, next) {
    var sql = `SELECT s.id,
    s.sno,
    s.name,
    s.sex,
    s.birthday,
    s.card,
    s.majorId,
    s.classId,
    s.departId,
    s.nativePlace,
    s.address,
    s.qq,
    s.phone,
    s.email,
    s.status,
    s.createTime,
    s.createUserId,
    s.updateTime,
    s.updateUserId, 
    d.name as departName, 
    m.name as majorName, 
    c.name as className, 
    u1.loginName as createUserName, 
    u2.loginName as updateUserName 
    FROM students s
    LEFT JOIN departments d ON s.departId = d.id
    LEFT JOIN majors m ON s.majorId = m.id
    LEFT JOIN classes c ON s.classId = c.id
    LEFT JOIN users u1 ON s.createUserId = u1.id
    LEFT JOIN users u2 ON s.updateUserId = u2.id
    `;
    pool.query(sql,function(err,result){
        if(err){
            res.json({
                code:201,
                message:"数据库操作失败"
            })
        }
        res.render('students/list', { title: '学生列表',students:result})
    })
})

router.get('/edit/:id',checkLogin,function(req,res,next){
    //params = parameter
    var id = req.params.id
    if(!id){
        res.json({code:201,message:"id必须填写"})
        return;
    }

    pool.query(`
    SELECT * FROM students where id = ?;
    SELECT * FROM majors where status = 0;
    SELECT * FROM classes where status = 0;
    SELECT * FROM departments where status = 0;
    `,[id],function(err,result){
        if(err){
            res.json({
                code:201,
                message:err
            })
            return
        }
        if(result[0].length != 1){
            res.json({
                code:202,
                message:"不存在"
            })
            return
        }
    
        res.render('students/edit',{title:'编辑学生',students:result[0][0],majors:result[1],classes:result[2],departs:result[3]})
    })
})

router.post('/edit',checkLogin,function(req,res,next){
    var id = req.body.id;
    var sno = req.body.sno;
    var name = req.body.name;
    var sex = req.body.sex;
    var birthday = req.body.birthday;
    var card = req.body.card;
    var majorId = req.body.majorId;
    var classId = req.body.classId;
    var departId = req.body.departId;
    var nativePlace = req.body.nativePlace;
    var address = req.body.address;
    var qq = req.body.qq;
    var phone = req.body.phone;
    var email = req.body.email;
    // 1. 服务器端判断是否为空
    if (!sno || !name || !birthday || !card) {
        res.json({
            code: 201,
            message: '学号，姓名，生日，身份证不能为空'
        })
        return;
    }
    pool.query('SELECT * from students where id = ?',[id],function(err,result){
        if(err){
            res.json({
                code:201,
                message:"数据库操作失败"
            })
            return
        }

        if(result.length != 1){
            res.json({
                code:202,
                message:"未知错误"
            })
            return;
        }
        var sql = `UPDATE students SET sno = ?,name = ?,sex = ?, birthday = ?,card =?,majorId = ?,classId=?,departId=?,nativePlace=?,address=?,qq=?,phone=?,email=?,updateTime=?,UpdateUserId=? where id = ? `
        var data =[sno,name,sex,birthday,card,majorId,classId,departId,nativePlace,address,qq,phone,email,new Date(),req.session.user.id,id]
        pool.query(sql,data,function(err,result){
            if(err){
                res.json({
                    code:201,
                    message:"数据操作失败"
                })
                return;
            }
            
            
            res.json({
                code:200,
                message:"修改成功"
            })
        })
    })
})

module.exports = router