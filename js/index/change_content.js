define(function (require,exports,mouald) { // 左右切换
	var $ = require('../tools/zepto.min.js');
	var main = require('../tools/slide.js');
	var button = $('.header-nav');
	var actionButton = button.eq(0);
	var moving = $('#moveLine');

	var changeContent = new main.slider('#container',{
		movingCallBack: function (x,count) {
			moving.css('-webkit-transform','translate3d(' + (count * moving.offset().width * 1.6 + (-x / 3)) + 'px,0px,0px)');
		},
		callBack: function (count,time) {
			actionButton.attr('id','');
			actionButton = button.eq(count).attr('id','action');
			moving.css('-webkit-transition','-webkit-transform ' + time * 0.001 + 's');
			moving.css('-webkit-transform','translate3d(' + count * moving.offset().width * 1.6 + 'px,0px,0px)');
			setTimeout(function () {
				moving.css('-webkit-transition','');
			},time);
		}
	});
	button
		.each(function (index,item) {
			$(item).attr('data-num',index);
		})
		.tap(function (e) {
			changeContent.moveTo($(this).attr('data-num'));
		});
});