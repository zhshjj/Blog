var perPage = 4;
var page = 1;
var pageCount;
var comments = [];

// 提交评论
$('#messageBtn').on('click', function(){
	$.ajax({
		type: 'POST',
		url: '/api/comment/post',
		data: {
			contentid: $('#contentId').val(),
			content: $('#messageContent').val()
		},
		success: function (responseData){

			$('#messageContent').val('');
			comments = responseData.data.comments.reverse();
			renderComment();						
		}
	})
});

// 每次页面重载时获取一下该文章的所有评论
$.ajax({
	url: '/api/comment',
	data: {
		contentid: $('#contentId').val()
	},
	success: function (responseData){
		comments = responseData.data.reverse();
		renderComment();
	}
})

$('.pager').delegate('a', 'click', function() {
	if ($(this).parent().hasClass('previous')) {
		page--;
	} else {
		page++;
	}

	renderComment();
});

function renderComment(){

	$('.messageCount').html(comments.length);

	pageCount = Math.max(Math.ceil(comments.length/perPage), 1);
	var start = Math.max((page-1)*perPage, 0);
	var end = Math.min(start + perPage, comments.length);
	var $lis = $('.pager li');
	$lis.eq(1).html(page+ '/' +pageCount);

	if (page <= 1) {
		page = 1;
		$lis.eq(0).html('<span>没有上一页了</span>');
	} else {
		$lis.eq(0).html('<a href="javascript:;">上一页</a>');
	}

	if (page >= pageCount) {
		page = pageCount;
		$lis.eq(2).html('<span>没有下一页了</span>');
	} else {
		$lis.eq(2).html('<a href="javascript:;">下一页</a>');
	}

	if (comments.length == 0) {
		$('.messageList').html('<p>还没有评论</p>');
	} else {
		var html = '';

		for (var i = start; i < end; i++){
			html += '<div class="messageBox">'+'<p class="name clearfix"><span class="fl">'+comments[i].username+'</span><span class="fr">'+formateDate(comments[i].postTime)+'</span></p><p>'+comments[i].content+'</p>'+'</div>';
		}

		$('.messageList').html(html);
	}
	
}

// 格式化时间
function formateDate(date){

	var d = new Date(date);
	var year = d.getFullYear();
	var month = (d.getMonth()+1);
	var day = d.getDate();
	var hour = d.getHours();
	var minute = d.getMinutes();
	var second = d.getSeconds();

	if (hour<10) {
		hour = '0' + hour;
	}

	if (minute<10) {
		minute = '0' + minute;
	}

	if (second<10) {
		second = '0' + second;
	}

	return year + '年' + month + '月' + day + '日' + hour + ':' + minute + ':' + second;
}