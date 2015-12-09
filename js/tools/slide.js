define(function (require,exports,module) {
	var $ = require('./zepto.min');//cmd化zepto


	var ArrayT = Array.prototype,
		StringT = Array.prototype,
		ObjectT = Array.prototype;

	var abs = Math.abs;

	
	var	timeGap = 400,
		timeAn = 400;

	var	startTime,
		endTime;

	var tan = Math.sqrt(3)/3;


	function _getElement (s) {
		return $(s);
	}
	function _FatherToChild (el) {
		var cArr = ArrayT.slice.call(el.children),
			content = [];
		cArr && cArr.forEach(function (item) {
			content.push(item);
		});
		return content;
	}
	function _initPostion (el) {

	}
	function __n2p () {
		var t = 0;
		for (var i = arguments.length - 1;i > -1;i--) {
			t += arguments[i];
		}
		return t + 'px';
	}
	function setStartTime () {
		return startTime = new Date();
	}
	function setEndtTime () {
		return endTime = new Date();
	}
	function compareTime() {
		var timer = (endTime - startTime)/1000;
		if (timer < 0.1) {
			return 0.1;
		} else if (timer > 0.2) {
			return 0.2;
		} else {
			return timer;
		}
	}




	function slider (contentOuter,config) {
		return new this.init(contentOuter,config);
	}
	/*
	*	1.content想要滑动的块的父级
	*	2.config
			2.1 type 类型page,only
			2.2 callback 每次滑动成功后执行回调
			2.3 movingCallBack touchmove滑动回调
			2.4 showScroll  1:0
	*
	*/
	var init = slider.prototype.init = function (contentOuter,config) {
		var father = this.contentOuter = _getElement(contentOuter)[0];
		touch.call(this,father);
		this.controlFlag = true;
		this.content = _FatherToChild(father);
		this.type = config.type;
		this.callBack = config.callBack; 
		this.movingCallBack	= config.movingCallBack;
		this.count = 0;
		this.timeGap = 500;
		this.scroll = config.scroll;
		this.init(this.content);
		this.onTouch();
		this.onMove();
		this.onEnd();
	};

	/*
	*	
	*	
	*	初始化slider
	*		
	*
	*/
	function touch (father) {
		this.x0;
		this.x1;
		this.y0;
		this.y1;
		this.time;
		this.content;
		this.hasSet;//设置向左右滑动的flag
		this.leftRight;//是否左右滑动状态
		this.len = father?father.children.length : '';
		this.dis = 0;
		this.moveFlag = false;
		this.controlFlag = true;
		this.width = father?$(father).offset().width : '';
		this.father = father;
	};

	touch.prototype.init = function (content) {
		this.content = content;
	}
	touch.prototype.onTouch = function () {
		var self = this;
		var el = this.father;
		$(el).on('touchstart',function (e) {
			setStartTime();
			e.stopPropagation();
			var ev = e.touches[0];
			self.time = new Date();	
			self.x0 = ev.pageX;
			self.y0 = ev.pageY;
		})
	}
	touch.prototype.onMove = function () {
		var self = this;
		var el = self.father;
		var content = self.content;
		$(el).on('touchmove',function (e) {
			if (self.controlFlag) {
				var ev = e.touches[0];
				self.x1 = ev.pageX;
				self.y1 = ev.pageY;
				if (!self.hasSet && abs(self.y1 - self.y0)/abs(self.x1 - self.x0) <= tan) {//滑动角度判断
					self.leftRight = true;			
				}
				if (self.leftRight) {
					e.preventDefault();
					self.dis += self.x1 - self.x0;
					if (self._shouldWork()) {
						self.moveFlag = true;
						content.forEach(function (item,index) {
							var i = $(item);
							i.css({
								'-webkit-transform':'translate3d(' + __n2p(self.dis,(index - self.count) * self.width)+ ',0,0)'
							})
						});
						self.movingCallBack && self.movingCallBack(self.dis,self.count);
					} else {
						content.forEach(function (item,index) {
							var i = $(item);
							i.css({
								'-webkit-transform':'translate3d(' + __n2p(self.dis * 0.1,(index - self.count) * self.width)+ ',0,0)'
							})
						})
					}
					
				}
				self.hasSet = true;
				self.x0 = self.x1;
				self.y0 = self.y1;
			}	
		});
	};
	touch.prototype.moveTo = function (count) {
		if (count < 0 || count > this.len) {
			throw 'count is bigger than len';
		}
		count--;
		this.count = count;
		this._successMove(true);
	}
	touch.prototype.onEnd = function (el) {
		var self = this;
		var el = self.father;
		var content = self.content;
		$(el).on('touchend',function (e) {
			setEndtTime();
			self.controlFlag = self.leftRight = self.hasSet = false;
			var ev = e.touches[0];
			if (self.moveFlag && self._isWork(el,self.dis,new Date())) {
				self._successMove(self.dis > 0?false:true,content);
			} else {
				self._failMove(content);
			}
			self.moveFlag = false;
			with (self) {
				y0 = y1 = x0 = x1 = dis = 0;
			}
		});
	};
	touch.prototype.f5 = function () {
		//this.contentOuter.style.height = $(this.content[this.count]).offset().height + 'px';
	}
	touch.prototype._successMove = function (b) {
		var self = this;
		var content = this.content;
		var time = compareTime();
		if (b) {
			if (this.count < this.len - 1) {
				this.count++;
			}
		} else {
			if (this.count > 0) {
				this.count--;
			}
		}
		
		self.f5();
		content.forEach(function (item,index) {
			self._addAnmation(item,time);
			self._anmationMove(item,index);
		});
	};
	touch.prototype._failMove = function (content) {
		var self = this;
		content.forEach(function (item,index) {
			self._addAnmation(item);
			self._anmationMove(item,index);
		});
	}
	touch.prototype._addAnmation = function (el,timer) {
		var self = this;
		var time = timer * 2000 || timeAn;
		$(el).css('-webkit-transition','-webkit-transform ' + time * 0.001 + 's');
		if (typeof this.callBack === 'function') {
			this.callBack(this.count,time);
		}
		setTimeout(function () {
			self._removeAnmation(el);
			self.controlFlag = true;
		},time);
	}
	touch.prototype._shouldWork = function () {
		return this.count * this.width - this.dis >= 0 && ((this.count == this.len - 1)?this.dis >= 0 : true);
	}
	touch.prototype._removeAnmation = function (el) {
		$(el).css('-webkit-transition','');
	}
	
	touch.prototype._anmationMove = function (item,index) {
		$(item).css('-webkit-transform','translate3d(' + __n2p((index - this.count) * this.width)   + ', 0px, 0px);')		
	
	}
	touch.prototype._isWork = function (el,dis,newTime) {
		return Math.abs(this.dis) > $(el).offset().width * 0.3 || (newTime - this.time < timeGap);
	}
	/*
	*	
	*	
	*	初始化touch
	*		
	*
	*/
	function scroll (target,config) {
		return new scroll.prototype.init(target,config);
	}
	scroll.prototype.init = function (target,config) {
		this.target = $(target);//滚动条
		this.scrollWapperHeight = config.scrollWapperHeight;//滚动元素总高度
		this.scrollOuter = $(config.scrollOuter);//滚动容器
		this.scrollOuterHeight = this.scrollOuter.offset().height;
		this.bili = this.scrollOuterHeight / this.scrollWapperHeight;
		this.height = this.scrollOuterHeight * this.bili;//滚动条高度
		this.timer;
		this.target.css('opacity','0');
		this.initHeight();
		this.initAnmation();
		this.onScroll();
	}
	scroll.prototype.init.prototype = {
		initHeight: function () {
			this.target.css('height',this.height + 'px');
		},
		initAnmation: function () {
			this.target.css('-webkit-transition','opacity 0.4s');
		},
		onScroll: function () {
			var self = this;
			self.scrollOuter.on('scroll',function () {
				self.target.css('opacity','1');
				clearTimeout(self.timer);
				self.timer = setTimeout(function () {
					self.target.css('opacity','0');
				},1000);
				self.target.css('-webkit-transform','translate3d(0px,' + (this.scrollTop * self.bili) + 'px' + ',0px)');
			})
		}
	}

	/*
	*	
	*	
	*	初始化滚动条
	*		
	*
	*/
	slider.prototype.init.prototype = new touch();
	try {
		navigator.control.gesture(false);//去你麻痹的uc
	} catch (e) {
		//.........
	}
	exports.slider = slider;
	exports.scroll = scroll;
});