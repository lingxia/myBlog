var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var routes = require('./routes');
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'uploads')));

// 跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");//预检请求使用
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");//预检请求使用
    next();
});
routes(app);
app.set('port', process.env.PORT || 3009);
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

