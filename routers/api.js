var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');

// 统一返回格式
var responseData;

router.use(function (req, res, next){
	//数据的初始化
	responseData = {
		//0表示没有错误
		code: 0,
		message: ''
	}

	next();
});
/*
用户注册
1.用户名不能为空
2.密码不能为空
3.两次输入密码必须一致
 */
router.post('/user/register', function (req, res){

	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.repassword;

	//用户名不为空
	if (username == '') {
		responseData.code = 1;
		responseData.message = '用户名不能为空';
		res.json(responseData);
		return;
	}

	//密码不为空
	if (password == '') {
		responseData.code = 2;
		responseData.message = '密码不能为空';
		res.json(responseData);
		return;
	}

	//两次密码不一样
	if (password != repassword) {
		responseData.code = 3;
		responseData.message = '两次密码不一样';
		res.json(responseData);
		return;
	}

	User.findOne({
		username: username
	}).then(function (newInfo){
		// 表示数据库中用户名存在时
		if (newInfo) {
			responseData.code = 4;
			responseData.message = '用户已经被注册';
			res.json(responseData);
			return;
		}
		// 把用户的数据保存到数据库中
		var user = new User({
			username: username,
			password: password
		});
		return user.save();
	}).then(function (newUserInfo){
		//成功
		responseData.message = '注册成功';
		res.json(responseData);
		return;
	});
});

// 用户登录
router.post('/user/login', function (req, res){
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({
		username: username,
		password: password
	}).then(function (userInfo){

		if (!userInfo) {
			responseData.code = 2;
			responseData.message = '用户名或密码不正确'
			res.json(responseData);
			return;
		}

		responseData.message = '用户名和密码正确'
		responseData.userInfo = {
			_id: userInfo._id,
			username: userInfo.username
		};
		req.cookies.set('userInfo', JSON.stringify({
			_id: userInfo._id,
			username: userInfo.username
		}));
		res.json(responseData);
		return;
	});
});

// 退出
router.get('/user/logout', function (req, res){
	req.cookies.set('userInfo', null);
	res.json(responseData);
});

// 获取文章的所有评论
router.get('/comment', function (req, res){
	var contentId = req.query.contentid || '';
	
	Content.findOne({
		_id: contentId
	}).then(function(content){
		responseData.data = content.comments;
		res.json(responseData);
	});
});

// 评论提交
router.post('/comment/post', function (req, res){
	
	// 内容的id
	var contentId = req.body.contentid || '';
	var postData = {
		username: req.userInfo.username,
		postTime: new Date(),
		content: req.body.content
	}

	// 查询当前这篇文章的内容信息
	Content.findOne({
		_id: contentId
	}).then(function(content){
		
		if (postData.content != '') {
			content.comments.push(postData);
			return content.save();
		}
		
	}).then(function(newContent){
		responseData.message = '评论成功';
		responseData.data = newContent;
		res.json(responseData);
	});
});

module.exports = router;