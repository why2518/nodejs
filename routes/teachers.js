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
    var sql = `
    SELECT * FROM majors WHERE status = 0;
    SELECT * FROM classes WHERE status = 0;
    SELECT * FROM departments WHERE status = 0;
    SELECT COUNT(*) as totalCount from teachers;
    SELECT s.id,s.tno,s.name,s.sex,s.birthday,s.card,s.majorId,s.classId,s.departId,s.nativePlace,s.address,s.qq,s.phone,s.email,s.status,s.createTime,s.createUserId,s.updateTime,s.updateUserId, d.name as departName, m.name as majorName, c.name as className, u1.loginName as createUserName, u2.loginName as updateUserName FROM teachers s
    LEFT JOIN departments d ON s.departId = d.id
    LEFT JOIN majors m ON s.majorId = m.id
    LEFT JOIN classes c ON s.classId = c.id
    LEFT JOIN users u1 ON s.createUserId = u1.id
    LEFT JOIN users u2 ON s.updateUserId = u2.id WHERE (1=1)`;
    var tno = req.query.tno;
    var name = req.query.name;
    var sex = req.query.sex;
    var majorId = req.query.majorId;
    var classId = req.query.classId;
    var departId = req.query.departId;
    var status = req.query.status;
    var birthdayBegin = req.query.birthdayBegin;
    var birthdayEnd = req.query.birthdayEnd;

    if (tno) {
        sql += ` AND s.tno like '%${tno}%'`;
    }
    if (name) {
        sql += ` AND s.name like '%${name}%'`;
    }
    if (sex && sex != -1) {
        sql += ` AND s.sex='${sex}'`;
    }
    if (majorId && majorId != -1) {
        sql += ` AND s.majorId='${majorId}'`;
    }
    if (classId && classId != -1) {
        sql += ` AND s.classId='${classId}'`;
    }
    if (departId && departId != -1) {
        sql += ` AND s.departId='${departId}'`;
    }
    if (status && status != -1) {
        sql += ` AND s.status='${status}'`;
    }
    if (birthdayBegin && birthdayEnd) {
        try {
            var begin = new Date(birthdayBegin);
            var end = new Date(birthdayEnd);

            if (begin >= end) {
                sql += ` AND s.birthday>='${birthdayEnd}' AND s.birthday<='${birthdayBegin}'`;
            } else {
                sql += ` AND s.birthday>='${birthdayBegin}' AND s.birthday<='${birthdayEnd}'`;
            }
        } catch (error) {
            res.json({ code: 201, message: '日期输入有误！' });
            return;
        }
    } else {
        if (birthdayBegin) {
            sql += ` AND s.birthday>='${birthdayBegin}'`;
        }
        if (birthdayEnd) {
            sql += ` AND s.birthday<='${birthdayEnd}'`;
        }
    }

    var page = req.query.page || 1;
    page = page -0;
    var pageSize = 10;
    
    sql += ` LIMIT ${(page-1) * pageSize},${pageSize}`

    pool.query(sql, function (err, result) {
        if (err) {
            res.json({
                code: 201,
                message: "数据库操作失败"
            })
            return
        }
        var totalCount = result[3][0].totalCount
        var totalPage = Math.ceil(totalCount/10)
        var pages = pager(page, totalPage);
        res.render('teachers/list', {
            title: "教师列表", teachers: result[4],
            majors: result[0],
            classes: result[1],
            departs: result[2],
            pageInfo:{
                page,       //当前页数
                pages,      //显示的页码范围
                pageSize,   //每页显示个数
                totalPage,  //总页数
                totalCount  //总记录数
            }
        })
    })

})


router.get('/edit/:id', checkLogin, function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        res.json({
            code: 201,
            message: "是SEI？！"
        })
        return
    }
    pool.query(`
    SELECT * FROM teachers where id = ?;
    SELECT * FROM majors where status = 0;
    SELECT * FROM classes where status = 0;
    SELECT * FROM departments where status = 0;
    `, [id], function (err, result) {
            if (err) {
                res.json({
                    code: 201,
                    message: err
                })
                return
            }
            if (result[0].length != 1) {
                res.json({
                    code: 202,
                    message: "不存在"
                })
                return
            }

            res.render('teachers/edit', { title: '编辑教师', teachers: result[0][0], majors: result[1], classes: result[2], departs: result[3] })
        })
})

router.post('/edit', checkLogin, function (req, res, next) {
    var id = req.body.id;
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
            message: '学号，姓名，生日，身份证不能为空'
        })
        return;
    }
    pool.query('SELECT * from teachers where id = ?', [id], function (err, result) {
        if (err) {
            res.json({
                code: 201,
                message: "数据库操作失败"
            })
            return
        }

        if (result.length != 1) {
            res.json({
                code: 202,
                message: "未知错误"
            })
            return;
        }
        var sql = `UPDATE teachers SET tno = ?,name = ?,sex = ?, birthday = ?,card =?,majorId = ?,classId=?,departId=?,nativePlace=?,address=?,qq=?,phone=?,email=?,updateTime=?,UpdateUserId=? where id = ? `
        var data = [tno, name, sex, birthday, card, majorId, classId, departId, nativePlace, address, qq, phone, email, new Date(), req.session.user.id, id]
        pool.query(sql, data, function (err, result) {
            if (err) {
                res.json({
                    code: 201,
                    message: "数据操作失败"
                })
                return;
            }


            res.json({
                code: 200,
                message: "修改成功"
            })
        })
    })
})

router.post('/remove', checkLogin, function (req, res, next) {
    var id = req.body.id
    if (!id) {
        res.json({
            code: 201,
            message: "教师不存在"
        })
        return;
    }
    pool.query(`UPDATE teachers set status = 1 where id = ?`, [id], function (err, result) {
        if (err) {
            res.json({
                code: 201,
                message: "数据库操作失败"
            })
            return;
        }
        res.json({
            code:200,
            message:"删除成功"
        })
    })
})

router.post('/multiRemove', checkLogin, function (req, res, next) {
    var ids = req.body.ids;
    console.log(ids)
    if (!ids) {
        res.json({ code: 201, message: '参数错误！' });
        return;
    }
    pool.query(`UPDATE teachers SET status = 1 WHERE id in (${ids})`, function (err, result) {
        if (err) {
            res.json({ code: 201, message: "数据库操作异常" });
            return;
        }

        res.json({ code: 200, message: '批量删除成功！' });
    })
})
module.exports = router