var express = require('express');
var checkToekn = require('../middleware/checkToken');
var router = express.Router();
router.get('/admin',function (req,res,next){
  res.send({
    type:true,
    name:'dailu'
  });
});
module.exports = router
