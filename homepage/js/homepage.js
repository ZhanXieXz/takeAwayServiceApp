//json
var foodsCart = {};
	//滚动条代码
    var myScroll1 = null;  
    var myScroll2 = null;  
    var myScroll3 = null;		    
    var myScroll4 = null;
    var myScroll5 = null;
//模板生成html
function _gettpl(tplName, data){
	return _.template($('#' + tplName).html())(data);
};

//阻止冒泡函数
function stopBubble(e) { 
	if(e && e.stopPropagation) { //非IE 
		e.stopPropagation(); 
		} else { //IE 
			window.event.cancelBubble = true; 
		} 
};

//购物车底部结算按钮（未满20）样式函数
function insufficientTwenty(){
	var check =$('.foot_price').text();
	check = parseInt(check.replace('￥',''));
	if (check<20&&check>0) {
	var condition=20-check
		$('.rectangleColor').removeClass('js-rectangleColor');
		$('.foot_distance').text('还差￥'+condition+'起送').removeClass('js_color').addClass('js_foot_distance');
	}else if(check==0){
		$('.foot_distance').text('￥20起送').addClass('js_foot_distance').removeClass('js_color');
		$('.rectangleColor').removeClass('js-rectangleColor');
		$('.foot_price').removeClass('js_color').addClass('js_foot_distance');
	}
};

//购物车底部结算按钮（满20）样式函数
function fullTwenty(){
	var check =$('.foot_price').text();
	check = parseInt(check.replace('￥',''));
	if (check>=20) {
		$('.rectangleColor').addClass('js-rectangleColor');
		$('.foot_distance').text('去结算').addClass('js_color','js_foot_distance');
	}else if(check<20){
	var condition=20-check
	$('.foot_distance').text('还差￥'+condition+'起送').addClass('js_foot_distance');
	$('.rectangleColor').removeClass('js-rectangleColor');
	}
};

//购物车蒙版
function mask(){
	$('.jsCarTab').addClass('mask_none');
	$('.js_wraps').css({'height':'auto','overflow':'initial'});
}
//绑定首页事件
function bindHomeEvet() {
	//商家公告优惠页蒙版切换
	$('.jsSeeNoticeBtn').click(function(){
		//公告页面
		$('#js-notice').html(_gettpl('js-notice-text', {'data': data}));
		$('.jsNoticeWrap').show();
	});

	//隐藏
	$('.button').click(function(){
		$('.jsNoticeWrap').hide();
	});

	//nav导航条高亮显示代码
	$('.nav_list').click(function(){
		$(this).siblings().removeClass("jsColor");
		$(this).addClass("jsColor");
		//商品、评价、商家页面的切换
		var linkTo = $(this).attr('link');
		$('.jscont').hide();
		$('.jscont[jsLink="'+linkTo+'"]').show();
		loaded();
	});

	$('.navs_list').click(function(){
		var listId = $(this).attr('id');
			listId = listId.replace('X','');
			myScroll4.scrollToElement('#' + listId,200);
	})

	//添加商品，购物车价格、高亮、结算按钮
	var numbers=0;
		//添加键点击事件
	$('.plus_img').off('click').on('click', function(e){
		//阻止冒泡函数
		stopBubble(e);
		var price = 0;
		//添加商品数量
			$(this).parent().removeClass('none');
			var num=$(this).prev().text();
			num++;
			$(this).prev().text(num);

		//购物车角标数量、高亮显示
			numbers++
			if (numbers!=0){
				$('.i').removeClass('nones');
				$('.carshow').removeClass('js');
			}else{
				$('.carshow').addClass('js');
			}
			$('.i').text(numbers)

		//购物车显示商品价格
			//商品价格
			var reg = Number($(this).parent().siblings('.commodity_price').children('.js_money').text());
			//购物车价格
			var check =$('.foot_price').text();
			check = parseInt(check.replace('￥',''));
			if (check===NaN) {
				return price+=reg
			}else{
				price=reg+check;
				$('.foot_price').addClass('js_color');
			}
			//购物车总价
			$('.jsCarMoney').text(price);

		//结算按钮函数（满20）
			fullTwenty();

		//购物车商品详情
			//json
			var foodsId = $(this).parents('.setmeal_1nav').attr('id'),
				foodsNum = $(this).prev().text(),
				foodsName = $(this).parent().siblings('.js-jump').children('.commodity_name').text(),
				foodsPrice = $(this).parent().siblings('.commodity_price').children('.js_money').text()
				food = {
					 	name:foodsName,
					 	price: foodsPrice,
					 	num:foodsNum, 
					 	id:foodsId	,
				};
				 if (foodsId ==foodsCart.id ) {
					 foodsCart.num++
				 }else{
					foodsCart[foodsId]=food;
				 }
			 setShopCartDom(foodsCart);
	});

	//购物车详情页函数
	function setShopCartDom(foodsCart){
		$('#js-shopCart').html(_gettpl('js-shopCartDetails', {'foodsCart': foodsCart}));
	};

	//删减商品，购物车价格，高亮切换，结算按钮
	$('.plus_img0').click(function(e){
		//阻止冒泡函数
		stopBubble(e);
		//商品数量
		var currentNum = Number($(this).next().text());
		currentNum--;
		if(currentNum == 0){
			$(this).parent().addClass('none');
		}else {
			$(this).parent().removeClass('none');
		}
		//购物车角标、高亮切换
		numbers--
		$(this).next().text(currentNum);
		if (numbers==0||$('.i').text()=='') {
			$('.i').addClass('nones');
			$('.carshow').addClass('js');
		}
		$('.i').text(numbers);
		//购物车内部
			//获取商品id
		var carFoodsId = $(this).parents('.setmeal_1nav').attr('id'),
			//购物车内部商品数量
			carfoodsNum = $('#js-shopCart').find('.car_plus').text();
			carfoodsNum--;
			//购物车内部商品最终数量
		$('#js-shopCart').find('li[id="'+carFoodsId+'"] .car_plus').text(currentNum);
			//价格
			var not =Number($(this).parent().siblings('.commodity_price').children('.js_money').text());
			var carNot = $('.foot_price').text();
			carNot =parseInt(carNot.replace('￥',''));
			var n =carNot-not
			if (n>0) {
				$('.foot_price').addClass('js_color');
			}else{
				$('.foot_distance').removeClass('js_color').addClass('js_foot_distance');
			}
			if (carfoodsNum == 0) {
				$('.car_list[id="'+carFoodsId+'"]').addClass('nones');
			}
			$('.jsCarMoney').text(n);

			//结算按钮函数（未满20）
			insufficientTwenty();
			//json商品数量删减
			var	foodsId = $(this).parents('.setmeal_1nav').attr('id');
				foodsCart[foodsId].num=	foodsCart[foodsId].num - 1;
				if(foodsCart[foodsId].num == 0){
					delete foodsCart[foodsId];
				}
	});

	//购物车内按钮
		//删减按钮
	$('.car_ul_wrap').on('click','.car_plusImgF',function(e){
		//阻止冒泡
		stopBubble(e);
			//商品数量
		var carFoodNum = $(this).next().text(),
			//购物车商品id
			carFoodsId = $(this).parents('.car_list').attr('id'),
			//购物车商品价钱
			foodsPrice = $(this).prev().children('.js_money').text(),
			//购物车总价
			carPrice = $('.jsCarMoney').text(),
			carPrice = carPrice - foodsPrice;
			carFoodNum--;
			//购物车角标
			numbers--;
			//购物车角标高亮
			if (numbers==0||$('.i').text()=='') {
				$('.i').addClass('nones');
				$('.carshow').addClass('js')	
			}
			$('.i').text(numbers);
			//json
			foodsCart[carFoodsId].num=	foodsCart[carFoodsId].num - 1;
			if(foodsCart[carFoodsId].num == 0){
				delete foodsCart[carFoodsId];
			}
			//商品页商品数量，等于0隐藏
		if (carFoodNum == 0){
			$(this).parents('.car_list').remove();
			$('#'+carFoodsId).find('.plus_img0').addClass('nones').next().text(carFoodNum).addClass('nones')
		}else{
			$(this).next().text(carFoodNum);
			$('#'+carFoodsId).find('.plus').text(foodsCart[carFoodsId].num);
		}
		if ($('.car_list').length == 0) {
			mask();
		}
		if (carPrice ==0 ) {
			$('.foot_price').removeClass('js_color').addClass('js_foot_distance');
		}
		//价格
		$('.jsCarMoney').text(carPrice);
		//购物车底部横栏结算按钮函数（未满20）
		insufficientTwenty();
	});
		//添加按钮
	$('.car_ul_wrap').on('click','.car_plusImgT',function(e){
		//阻止冒泡
		stopBubble(e);
			//商品数量
		var carFoodNum = $(this).prev().text(),
			//商品id
			carFoodsId = $(this).parents('.car_list').attr('id'),
			//商品价钱
			foodsPrice = Number($(this).siblings('.commodity_price').children('.js_money').text()),
			//购物车价钱
			carPrice = Number($('.jsCarMoney').text()),
			//商品页商品数量
			carFoodsNum = $('#'+carFoodsId).find('.plus').text();
			carFoodsNum++
			//购物车总价钱
			carPrice = carPrice + foodsPrice;
			carFoodNum++;
			numbers++;
			//json数据
			foodsCart[carFoodsId].num=	Number(foodsCart[carFoodsId].num) + 1;
			if(foodsCart[carFoodsId].num == 0){
				delete foodsCart[carFoodsId];
			}
			console.log(foodsCart);
			//购物车角标
			$('.i').text(numbers);
			//商品数量
			$(this).prev().text(carFoodNum);
			//商品页商品数量
			$('#'+carFoodsId).find('.plus').text(carFoodsNum);
			//购物车价钱
			$('.jsCarMoney').text(carPrice);
			//结算按钮函数（满20）
			fullTwenty();
	});

	//清空按钮
	$('.empty').click(function(e){
		//购物车角标统计重新赋值为0
		numbers=0;
		//json赋值为空
		foodsCart={};
		//阻止冒泡函数
		stopBubble(e);
		//清除购物车
		$('.car_list').remove();
		//购物车总价为0
		$('.jsCarMoney').text('0');
		//商品页商品数量为0
		$('.plus').text('0').parent().addClass('none');
		//购物车高亮
		$('.carshow').addClass('js');
		//购物车角标
		$('.i').text(numbers).addClass('nones');
		//购物车蒙版函数
		mask();
		//结算按钮（未满20）
		insufficientTwenty();
	})

	//购物车详情页的页面切换
	$('.jsCar').click(function(){
		$('.jsCarTab').toggleClass('mask_none');
		if($('.jsCarTab').hasClass('mask_none')){
			$('.js_wraps').css({'height':'auto','overflow':'initial'})
		}else {
			var height = $(window).height()+'px';
			$('.js_wraps').css({'height':height,'overflow':'hidden'})
		}
		loaded();
	});
	

	function loaded() {
	    myScroll1.refresh();  
	    myScroll2.refresh();  
	    myScroll3.refresh();		    
	    myScroll4.refresh();
	    myScroll5.refresh();
	}
	function firstloaded() {
	    myScroll1 = new iScroll('wrapper');  
	    myScroll2 = new iScroll('wrapper-hide');  
	    myScroll3 = new iScroll('wrapper-hides');		    
	    myScroll4 = new iScroll('next-wrapper-hide');
	    myScroll5 = new iScroll('car-wrapper-hide');
	}
	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
	document.addEventListener('DOMContentLoaded', function () { setTimeout(firstloaded, 200); }, false);

	// 滚动条页面高度
	//window页面高度
	var height = $(window).height();
	//获取减去的页面高度
	var heights = Number(95+82+247+64);
	height = height-heights;
	height = height+'px';
	//left-nav导航高度
	$('.height').css('height',height);
	//right-nav商品页高度
	$('#next-wrapper-hide').css('height',height);
	//评价页高度
	$('#wrapper-hide').css('height',height);
	//商家页高度
	$('#wrapper-hides').css('height',height);
};

//页面入口
function init(){
	//渲染头部
	$('#headWrap').html(_gettpl('headTpl', {'data': data}));
	//head公告条
	$('#js-noticeWrap').html(_gettpl('js-noticeWrap-text', {'data': data}));
	//渲染左侧商品类型列表
	$('#jsNavs').html(_gettpl('navs-list', {'data': data}));
	//渲染右侧商品类型列表
	$('#js-parent').html(_gettpl('one-person', {'data': data}));
	//评价页评分
	$('#js-evaluateUl').html(_gettpl('js-evaluate', {'data': data}));
	//评价页客户评价
	$('#js-ratings').html(_gettpl('js-ratings-all', {'data': data}));
	//商家页渲染
	$('#js-introduce-head').html(_gettpl('js-introduces-head-text', {'data': data}));

	bindHomeEvet();
};
init();

//评价页-只看有内容的评价-on
$('.evaluation-grey').click(function(){
	$(this).hide();
	$('.evaluation-green').show();
	var jsempty = $('.customerId_evaluation').attr('show');
	$('.jsShow').hide();
	$('.customerId_evaluation[show="'+jsempty+'"]').parents('.jsShow').show();
});

//评价页-只看有内容的评价-OFF
$('.evaluation-green').click(function(){
	$(this).hide();
	$('.evaluation-grey').show();
	$('.jsShow').show();
});

//满意、不满意评价切换
$('.jsSelectStar').click(function(){
	var _index = $(this).index();
	if(_index == 0){
		$('.jsShow').show();
	}else if(_index == 1){
		$('.jsShow').each(function(index, value){
			var score = $(this).attr('score');
			if(score > 3) {
				$(this).show();
			}else {
				$(this).hide();
			}
		});
	}else {
		$('.jsShow').each(function(index, value){
			var score = $(this).attr('score');
			if(score <= 3) {
				$(this).show();
			}else {
				$(this).hide();
			}
		});	
	}
});

//商家页收藏按钮高亮、文本切换
$('.jsstart').click(function(){
	var texts =	$('.collection').text();
	if (texts=='收藏') {
		$('.love').removeClass('nones');
		$('.collection').text('已收藏');
	}else if (texts=='已收藏') {
		$('.jsstartHide').addClass('nones');
		$('.collection').text('收藏');
	}
});



//点击跳转商品详情评价
$('.setmeal_1nav').click(function(){
	//点击打印id
	var food = {};
	for (var i = 0; i <data.goods.length; i++) {
		for (var j = 0; j < data.goods[i].foods.length; j++) {
			if ($(this).attr('id')== data.goods[i].foods[j].id) {
				food = data.goods[i].foods[j];
			}
		}
	}
	var _html = _gettpl('js-food-text', {'food': food});
	$('.js-wrap').hide();
	$('#js-food').html(_html).show();
});

$('#js-food').on('click','.return',function(){
	$('#js-food').empty().addClass('food-none');
	$('.js-wrap').css('display','block');
});
