var express = require('express');
var router = express.Router();
var Category = require('../models/Category');
var Content = require('../models/Content');
var data;

// 使用中间件处理通用的数据
router.use(function (req, res, next){

	data = {
		userInfo: req.userInfo,
		categories: []
	}

	Category.find().then(function(categories){
		data.categories = categories;
		next();
	})
});

// 首页
router.get('/', function(req, res, next){

	
	data.category = req.query.category || '';
	data.page = Number(req.query.page || 1);
	data.limit = 3;
	data.pageCount = 0;
	data.count = 0;

	var where = {};

	if (data.category) {
		where.category = data.category;
	}

	// 读取所有的分类信息
	Content.where(where).count().then(function (count){

		data.count = count;

		// 计算总页数
		data.pageCount = Math.ceil(data.count/data.limit);
		// 取值不能超过pages
		data.page = Math.min(data.page, data.pageCount);
		// 取值不能小于1
		data.page = Math.max(data.page, 1);
		var skip = (data.page-1)*data.limit;

		return Content.where(where).find().limit(data.limit).skip(skip).populate(['category','user']).sort({
			addTime: -1
		});

	}).then(function (contents){
		
		data.contents = contents;
		res.render('main/index', data);

	});	
	
});

// 阅读全文
router.get('/view', function(req, res){

	var contentId = req.query.contentId || '';

	Content.findOne({
		_id: contentId
	}).then(function (content){
		data.content = content;

		content.views++;
		content.save();

		res.render('main/view', data);
	});
});
module.exports = router;