var express = require("express")
var router = express.Router()
var pool = require('../modules/db.js');
var md5 = require('md5');
var checkLogin = require('../modules/checkLogin.js');
var pager = require('../modules/pager');


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
        console.log(majors, classes, departs)
        res.render('teachers/add', { title: "教师添加", majors, classes, departs })
    })

})

router.post('/add', checkLogin, function (req, res, next) {
    var tno = req.body.tno;
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
    if (!tno || !name || !birthday || !card) {
        res.json({
            code: 201,
            message: '教师编号，姓名，生日，身份证不能为空'
        })
        return;
    }

    // 2.验证数据库中是否已有sno
    var sql = `SELECT * FROM teachers WHERE tno = ?`
    pool.query(sql, [tno], function (err, result) {
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
                message: "该教师已注册"
            })
            return;
        }
        // 3. 向user和student表插入数据
        var sql = `INSERT INTO teachers(tno,name,sex,birthday,card,majorId,classId,departId,nativePlace,address,qq,phone,email,status,createTime,createUserId)VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        var data = [tno, name, sex, birthday, card, majorId, classId, departId, nativePlace, address, qq, phone, email, 0, new Date(), req.session.user.id];
        pool.query(sql, data, function (err, result) {
            if (err) {
                res.json({ code: 203, message: err });
                return;
            }

            pool.query("INSERT INTO users(loginName, password, type, status)VALUE(?,?,?,?)", [name, md5('123456'), 1, 0], function (err, result2) {
                if (err) {
                    res.json({ code: 202, message: "数据库操作异常202！" });
                    return;
                }

                res.json({ code: 200, message: '保存成功！' })
            })
        })
    })

})
router.get('/list', function (req, res, next) {
    res.render('teachers/list', { title: "教师列表" })
})


module.exports = router