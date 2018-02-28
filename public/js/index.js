$(function (){
	var $register = $('.register');
	var $login = $('.login');
	var $userInfo = $('.userInfo');
	var $logout = $('.logout');

	$register.find('a').on('click', function (){
		$register.hide();
		$login.show();
	});

	$login.find('a').on('click', function (){
		$login.hide();
		$register.show();
	});

	// 用ajax实现注册功能
	$register.find('button').on('click', function (){
		$.ajax({
			type: 'post',
			url: '/api/user/register',
			data: {
				username: $register.find('[name="username"]').val(),
				password: $register.find('[name="password"]').val(),
				repassword: $register.find('[name="repassword"]').val()
			},
			dataType: 'json',
			success: function (result){
				$register.find('.colWarming').html(result.message);

				if (!result.code) {
					setTimeout(function(){
						$register.hide();
						$login.show();
					},1000);
				}
			}
		});
	});

	// 用ajax实现登陆功能
	$login.find('button').on('click', function (){
		$.ajax({
			type: 'post',
			url: '/api/user/login',
			data: {
				username: $login.find('[name="username"]').val(),
				password: $login.find('[name="password"]').val()
			},
			dataType: 'json',
			success: function (result){
				$login.find('.colWarming').html(result.message);

				if (!result.code) {
					window.location.reload();
				}				
			}
		});
	});

	// 退出
	$logout.on('click', function (){
		$.ajax({
			type: 'get',
			url: '/api/user/logout',
			dataType: 'json',
			success: function (result){
				
				if (!result.code) {
					window.location.reload();
				}				
			}
		});
	});

})