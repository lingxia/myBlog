var express =require('express');
var router = express.Router();
var api = require('../api');
var multer = require('multer');
var fs = require('fs');
var checkToken = require('../middleware/checkToken');

//使用multer的磁盘存储
var storage =  multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../static')
    },
    filename: function (req, file, cb) {
      var fileClass = file.originalname.split('.')[1];
      cb(null, 'pic_' + Date.now() + '.' + fileClass);
    }
});
var upload = multer({
    storage: storage
});

router.post('/file/upload', upload.single('pic'), function(req, res, next){
  var filepath = req.file.path;
  var filename = req.file.filename;
  var originalname = req.file.originalname;
  if(filename){
    res.send({
      code: 200,
      filename:filename,
      filepath:filepath,
      originalname:originalname
    });
  }else{
    res.send({
      code: -200,
      message: '文件上传失败'
    })
  }
});

router.post('/file/delete',function(req, res, next){
  fs.unlink(req.body.filepath, function(err){
      if(err){
        res.send({
          code: -200,
          message: '删除文件失败'
        })
      }else{
        res.send({
          code: 200
        })
      }
  })
});

module.exports = router;

