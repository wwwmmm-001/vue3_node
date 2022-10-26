const express = require('express')
const app = express()
const mysql = require('mysql2');
const size = require('image-size')

const fs = require('fs')
const path = require('path')



const bodyParser = require('body-parser')
const { urlencoded } = require('express');
const { resolve, dirname } = require('path');
const { clear } = require('console');
const { send } = require('process');

const cors = require('cors')
app.use(cors())

// mysql
var db = mysql.createPool({
    host: 'localhost',
    // =========================================================
    // user: 'www',
    user: 'root',
    password: '123456',
    database: 'testweb'
});

// 读取文件 promise封装
const readFile = function (path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        })
    })
}
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
// app.use(express.json({limit : '10000kb'}));

// 登录
app.post('/login', (req, res) => {
    const body = req.body
    if (body.user == 'admin' && body.password == '123456') {
        res.send({
            status: 200,
            msg: '登录成功',
        })
    } else {
        res.send({
            status: 0,
            msg: 'user: admin <br/><br/> pw : 123456',
        })
    }
})

// 此处返回用户基本信息和头像  图片返回为路径
app.get('/BasicMsg', (req, res) => {
    let sql_avatar = 'select path from avatar where id=1'
    let sql_message = 'select * from message'
    const personal_data = {}  // 基本信息和头像 容器 

    // 获取头像
    let p1 = new Promise((resolve, reject) => {
        db.query(sql_avatar, (err, result) => {
            personal_data.avatar = result[0].path
            resolve(null)
        }
        )
    }
    )

    // 获取基本信息
    let p2 = new Promise((resolve, reject) => {
        db.query(sql_message, (err, result) => {
            personal_data.message = result[0]
            resolve(null)
        }
        )
    }
    )


    Promise.all([p1, p2]).then(() => { res.send(personal_data); })


})
// 请求 head 图片
app.get('/head/Image', (req, res) => {
    let Img_path = path.join(__dirname, '/headPhoto', req.query.path)
    readFile(Img_path).then((data) => {
        res.send(data)
    }).catch((err) => {
        res.send('没有此图片')
    })
})
// 请求 blogs 图片
app.get('/blogs/Image', (req, res) => {
    let Img_path = path.join(__dirname, 'blogs_img', req.query.path)
    readFile(Img_path).then((data) => {
        setTimeout(() => res.send(data), 500)
    }).catch((err) => {
        res.send('没有此图片')
    })
})

// 请求blogs初始化
app.get('/blogs/init', (req, res) => {
    const sql_select = 'select * from blogs order by id desc limit 0,6'
    db.query(sql_select, (err, result) => {
        if (err) { console.log('文章初始化 err'); }
        else {
            let left = []
            let right = []
            let head=[]
            for (let i = 0; i < result.length; i++) {
                if(result[i].head){
                    head.push(result[i])
                }
                if (i % 2 == 0) left.push(result[i])
                else right.push(result[i])
            }
            let data = {
                page: result[result.length - 1].id,
                left,
                right,
                head
            }
            setTimeout(() => res.send(data), 800)
        }
    })
})

// 后续请求blogs
app.get('/blogs', (req, res) => {
    const sql_select = `select * from blogs where id < ${req.query.page} order by id desc limit 0,2`
    db.query(sql_select, (err, result) => {
        if (err) { console.log('请求文章 err'); }
        else {
            if (result.length == 0) res.send({ status: 0 })
            else {
                result.unshift(result[result.length - 1].id)
                setTimeout(() => res.send(result), 350)
            }
        }
    })

})

// LookImg 随机图片请求 此处同 请求blogs 时所用文件夹
app.get('/LookImg', (req, res) => {
    let left = []
    let middle = []
    let right = []
    // 随机9张图片路径 分别追加
    let temp_switch = 0
    while (temp_switch < 9) {
        let random = Math.ceil(Math.random() * 47)
        if (temp_switch <= 2) left.push({
            img: `img${random}.jpg`,
            size: size(path.join(__dirname, 'Look_lookImg_img', `img${random}.jpg`))
        })
        else if (temp_switch <= 5) middle.push({
            img: `img${random}.jpg`,
            size: size(path.join(__dirname, 'Look_lookImg_img', `img${random}.jpg`))
        })
        else right.push({
            img: `img${random}.jpg`,
            size: size(path.join(__dirname, 'Look_lookImg_img', `img${random}.jpg`))
        })
        temp_switch++
    }
    res.send({
        left, middle, right,
    })
})
// LookImg 请求图片
app.get('/lookImg/Image', (req, res) => {
    let Img_path = path.join(__dirname, 'Look_lookImg_img', req.query.path)
    readFile(Img_path).then((data) => {
        setTimeout(() => res.send(data), 500)
    }).catch((err) => {
        res.send('没有此图片')
    })
})

// Look 请求head部分
app.get('/Look/head', (req, res) => {
    const sql_select = `select * from  look_head`
    db.query(sql_select, (err, result) => {
        result.forEach((data) => {
            data.name = (data.name).split('-=');
        })
        res.send(result)
    })
})
// Look 请求head 图片
app.get('/Look/headImg', (req, res) => {
    let Img_path = path.join(__dirname, 'Look_head_img', req.query.path)
    readFile(Img_path).then((data) => {
        setTimeout(() => res.send(data), 500)
    }).catch((err) => {
        res.send('没有此图片')
    })
})
// Look anime 返回信息
app.get('/Look/anime', (req, res) => {
    let filter = req.query.filter.split(',')
    let sql_select = 'select * from anime'
    if (filter[0] != '*' || filter[1] != '*') {
        let time = filter[1] != '*' ? filter[1].split('-') : filter[1]
        if (filter[0] != '*' && filter[1] != '*') {
            if (time.length > 1) sql_select = setSql_select(1, filter, time)
            else sql_select = setSql_select(2, filter)
        }
        else if (filter[1] != '*') {
            if (time.length > 1) sql_select = setSql_select(3, filter, time)
            else sql_select = setSql_select(4, filter)
        }
        else sql_select = setSql_select(5, filter, time)
    }
    db.query(sql_select, (err, result) => {
        if (err) { console.log(err); }
        else {
            result.forEach((val) => {
                val.name = (val.name).split('-=')
                val.label = (val.label).split('-=')
            })
            setTimeout(() => {
                res.send(result)
            }, 700)

        }

    })
})
function setSql_select(num, filter, time) {
    switch (num) {
        case 1: return `select * from anime where type='${filter[0]}' and show_time between ${time[1]} and ${time[0]}`
        case 2: return `select * from anime where show_time = ${filter[1]} and type='${filter[0]}'`
        case 3: return `select * from anime where show_time between ${time[1]} and ${time[0]}`
        case 4: return `select * from anime where show_time = ${filter[1]}`
        case 5: return `select * from anime where type='${filter[0]}'`
    }


}
// Look anime detail请求
app.get('/Look/anime/detail', (req, res) => {
    let id=req.query.id
    const sql_select = `select id,name,label,url,fullTime,detail from anime where id=${id}`
    let readDir = fs.readdirSync(__dirname + `/Look_anime_img/${id}`)
    db.query(sql_select, (err, result) => {
        if (err) res.send(err);
        else {
            let detail = {
                content: result[0],
                img_path: readDir
            }
            res.send(detail)
        }
    })
})

// Look anime 请求图片
app.get('/Look/animeImg', (req, res) => {
    let Img_path = path.join(__dirname, 'Look_anime_img', req.query.path)
    readFile(Img_path).then((data) => {
        setTimeout(() => res.send(data), 500)
    }).catch((err) => {
        res.send('没有此图片')
    })
})
// Look video 返回信息
app.get('/Look/video', (req, res) => {
    let sql_select = 'select * from video'
    db.query(sql_select, (err, result) => {
        if (err) console.log(err);
        else {
            res.send(result);
        }
    })
})
// Look video 请求图片
app.get('/Look/videoImg', (req, res) => {
    let Img_path = path.join(__dirname, 'Look_video_img', req.query.path)
    readFile(Img_path).then((data) => {
        setTimeout(() => res.send(data), 500)
    }).catch((err) => {
        res.send('没有此图片')
    })
})
// Look eiga 返回信息
app.get('/Look/eiga', (req, res) => {
    let sql_select = 'select * from eiga'
    db.query(sql_select, (err, result) => {
        if (err) console.log(err);
        else {
            res.send(result);
        }
    })
})
// Look eiga 请求图片
app.get('/Look/eigaImg', (req, res) => {
    let Img_path = path.join(__dirname, 'Look_eiga_img', req.query.path)
    readFile(Img_path).then((data) => {
        setTimeout(() => res.send(data), 500)
    }).catch((err) => {
        res.send('没有此图片')
    })
})
// header music 返回音乐列表
app.get('/home/musicList', (req, res) => {
    let readDir = fs.readdirSync(__dirname + '/home_music/')
    let musicList=[]
    for(let i=0;i<readDir.length;i++){
        musicList.push(readDir[i].substring(0,readDir[i].length-4))
    }
    res.send(musicList)
})
// header music 请求音乐
app.get('/home/music', (req, res) => {
    let music_path = path.join(__dirname, 'home_music', `${req.query.path}.mp3`)
    readFile(music_path).then((data) => {
        setTimeout(() => res.send(data), 500)
    }).catch((err) => {
        res.send('没有此music')
    })

})
// 接收上传封面图片,及标题内容等写入数据库
app.post('/upload/cover', (req, res) => {
    const sql_insert1 = `insert into blogs values(${req.body.id},'${req.body.title}','${req.body.detail}','${req.body.path}','${req.body.time}',0)`
    const sql_insert2 = `insert into blogs_content values(${req.body.id},'${req.body.content}')`
    let sql_err = 0
    let p1 = new Promise((resolve, reject) => {
        db.query(sql_insert1, (err, result) => {
            if (err) {
                console.log(err);
                sql_err = 1
            } else {
                resolve(null)
            }
        }
        )
    }
    )
    let p2 = new Promise((resolve, reject) => {
        db.query(sql_insert2, (err, result) => {
            if (err) {
                console.log(err);
                sql_err = 1
            } else {
                resolve(null)
            }
        }
        )
    }
    )
    Promise.all([p1, p2]).then(() => {
        if (sql_err) {
            const sql_del1 = `delete from blogs where id=${req.body.id}`
            const sql_del2 = `delete from blogs_content where id=${req.body.id}`
            db.query(sql_del1)
            db.query(sql_del2)
            res.send(0)
        } else {
            const path = `./blogs_img/${req.body.path}.png`;
            const base64 = (req.body.img).replace(/^data:image\/\w+;base64,/, "");//去掉图片base64码前面部分data:image/png;base64
            const dataBuffer = Buffer.from(base64, 'base64'); //把base64码转成buffer对
            fs.writeFile(path, dataBuffer, (err) => {
                if (err) {
                    console.log('写入失败');
                    res.send('0')
                } else {
                    console.log('写入成功');
                    res.send("1")
                }

            })
        }
    })
})
//编写博客文章时 给予文章编号,即sql数据库最后ID + 1
app.get('/getEditorId', (req, res) => {
    const sql_select = 'select id from blogs order by id desc limit 0,1'
    db.query(sql_select, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            let editor_id = result[0].id + 1;
            res.send(`${editor_id}`)
        }
    })
})
// 请求文章详细内容
app.get('/getArticle', (req, res) => {
    const sql_select = `select content from blogs_content where id=${req.query.id}`
    db.query(sql_select, (err, result) => {
        if (err) {
            console.log(err);
            res.send(0)
        } else {
            res.send(result[0])
        }
    })
})
// 接收留言
app.post('/leaveMessage', (req, res) => {
    let body = req.body
    const sql_insert = `insert into leavemsg values(0,'${body.name}','${body.email}','${body.title}','${body.message}')`
    db.query(sql_insert, (err, result) => {
        if (err) console.log(err)
        else res.send('1')
    })
})

// 请求 collect 资源信息
app.get('/collect/download', (req, res) => {
    const sql_select = 'select * from collect'
    db.query(sql_select, (err, result) => {
        if (err) console.log(err);
        else {
            res.send(result)
        }
    })

})
// collect 资源 检索
app.get('/collect/search', (req, res) => {    
    let search = req.query.search    
    const sql_select = `select * from collect where name like '%${search}%'`
    db.query(sql_select, (err, result) => {
        if (err) console.log(err);
        else {
            res.send(result)
        }
    })
})
app.listen(8088, () => {
    console.log('runing');
})

