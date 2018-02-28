// 应用程序的入口
var express = require('express');
// 加载模板处理模块----实现前后端的分离
var swig = require('swig');
// 加载数据模块
var mongoose = require('mongoose');
// 加载body-parser，用来处理post提交过来的数据
var bodyParser = require('body-parser');
// 加载cookies模块
var Cookies = require('cookies');

var app = express();

var User = require('./models/User');

// 设置静态文件托管
app.use('/public', express.static(__dirname + '/public'));

// 配置应用模板
// 定义当前应用所使用的模板引擎，使用 swig.renderFile 解析
// 第一个参数： 模板引擎的名称，同时也是模板引擎的后缀，第二个参数表示用于解析处理模板内容的方法
app.engine('html', swig.renderFile);
// 设置模板文件存放的目录。第一个参数必须是views,第二个是参数是目录
app.set('views', './views');
// 注册所使用的模板引擎，第一个参数必须是view engine，第二个参数和app.engine这个方法中定义的模板引擎的名称是一致的
app.set('view engine', 'html');
// bodyparser设置
app.use( bodyParser.urlencoded({extended: true}) );
// cookies的设置
app.use(function(req, res, next){
	req.cookies = new Cookies(req, res);

	// 解析cookies记录的用户信息
	req.userInfo = {};
	if (req.cookies.get('userInfo')) {
		try {
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));

			// 获取当前用户类型，是否是管理员
			User.findById(req.userInfo._id).then(function (userInfo){
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
				next();
			});
		} catch (e){
			next();
		}
	} else {
		next();
	}
});
// 在开发过程中，需要取消模板缓存extended: true
swig.setDefaults({cache: false});

//根据不同的功能划分模块
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

// 监听HTTP请求
mongoose.connect('mongodb://localhost:27017/blog', function (err){
	if (err) {
		console.log('数据库连接失败');
	}else {
		console.log('数据库连接成功');
		app.listen(9090);
		console.log('open port 9090 ...');
	}
});
