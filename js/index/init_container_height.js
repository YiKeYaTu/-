define(function (require,exports,mouald) { // 初始化页面滚动容器高度
	var timer;
	var $ = require('../tools/zepto.min.js');
	var initHeight = function (o,main) { // o 其他占据页面位置的元素 main 想要初始化高度的元素
		var container;
		var otherEl;
		var otherHeight = 0;
		var bodyHeight = window.innerHeight;
		if (arguments.length == 1) {
			container = o;
		} else {
			otherEl = o;
			container = main;
		}
		otherEl.forEach(function (item) {
			otherHeight += $(item).offset().height;
		});
		container.forEach(function (item) {
			$(item).css('height',bodyHeight - otherHeight + 'px');
		});
	}
	initHeight(['header'], ['#container', '.content']);
	$(window).on('resize',function () {
		clearTimeout(timer);
		timer = setTimeout(function () {
			initHeight(['header'], ['#container', '.content']);
		},100);
	});
});