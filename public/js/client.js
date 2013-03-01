var start = function() {

	window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {
		window.setTimeout(callback, 1000 / 60);
		};
	})();

	function near(x, y, ax, ay, r) {
		if (Math.pow(x - ax, 2) + Math.pow(y - ay, 2) <= Math.pow(r, 2)) {
			return 1;
		} else {
			return 0;
		}
	}
	
	function dentro(x, y, r, ax, ay, ar) {
		if (Math.pow(x - ax, 2) + Math.pow(y - ay, 2) <= Math.pow(ar - r, 2)) {
			return 1;
		} else {
			return 0;
		}
	}
	
	var mouse,
		win = {
			color: {
				arr:[
					"rgba(255,0,0,0.5)",
					"rgba(0,255,0,0.5)"
					],
				cur: 0
			},
			score: 0,
			timer: 20,
			balls: [
	{
		id: "conejo1",
		color: "rgba(255,0,0,0.5)"
	},
	{
		id: "tortuga1",
		color: "rgba(0,255,0,0.5)"
	},
	{
		id: "conejo2",
		color: "rgba(255,0,0,0.5)"
	},
	{
		id: "tortuga2",
		color: "rgba(0,255,0,0.5)"
	},
	{
		id: "conejo3",
		color: "rgba(255,0,0,0.5)"
	},
	{
		id: "tortuga3",
		color: "rgba(0,255,0,0.5)"
	},
	{
		id: "conejo4",
		color: "rgba(255,0,0,0.5)"
	},
	{
		id: "tortuga4",
		color: "rgba(0,255,0,0.5)"
	},
	{
		id: "conejo5",
		color: "rgba(255,0,0,0.5)"
	},
	{
		id: "tortuga5",
		color: "rgba(0,255,0,0.5)"
	},
	{
		id: "conejo6",
		color: "rgba(255,0,0,0.5)"
	},
	{
		id: "tortuga6",
		color: "rgba(0,255,0,0.5)"
	},
	{
		id: "conejo7",
		color: "rgba(255,0,0,0.5)"
	},
	{
		id: "tortuga7",
		color: "rgba(0,255,0,0.5)"
	},
	{
		id: "conejo8",
		color: "rgba(255,0,0,0.5)"
	},
	{
		id: "tortuga8",
		color: "rgba(0,255,0,0.5)"
	}
	]
		},
		w = $(window).width(),
		h = $(window).height(),
		el = document.createElement("canvas");
	el.width = w;//Math.min(w,h);
	el.height = h;//Math.min(w,h);
	document.body.appendChild(el);
	
	var image = new Image();
	
	var is_load=0;
	
	image.onload = function () {
		is_load = 1;
	};
	image.src = "img/frog.png";
	
	var image2 = new Image();
	
	var is_load2=0;
	
	image2.onload = function () {
		is_load2 = 1;
	};
	image2.src = "img/priz.png";
	var center = {
		r: Math.floor(Math.min(el.width, el.height) / 2),
		x: Math.floor(Math.min(el.width, el.height) / 2),
		y: Math.floor(Math.min(el.width, el.height) / 2)
	};
	
	var Ball = Backbone.Model.extend({
		back: function() {
			this.set("x", center.x + Math.floor(0.75 * center.r * Math.cos(this.get("alfa"))));
			this.set("y", center.y - Math.floor(0.75 * center.r * Math.sin(this.get("alfa"))));
		}
	});

	var C = Backbone.Collection.extend({
		model: Ball
	});

	var BallView= Backbone.View.extend({
		render : function() {
			this.options.ctx.beginPath();
			this.options.ctx.arc(this.model.get("x"), this.model.get("y"), this.model.get("r"), 0, 2 * Math.PI, false);
			this.options.ctx.fillStyle = this.model.get("color");
			this.options.ctx.fill();
			this.options.ctx.closePath();
		}
	});

	var CanvasView= Backbone.View.extend({
		render: function() {
			var ctx = this.el.getContext("2d"),
				w = this.el.width,
				h = this.el.height,
				m = Math.min(w, h),
				x,
				y;
			
			ctx.clearRect(0, 0, w, h);
			
			if (win.hasOwnProperty("winner")) {
				if (win.hasOwnProperty("image")) {
					x = m / 2 ;
					y = ((m / 2) / win.image.width) * win.image.height;
					ctx.drawImage(win.image, m/2 - x/2, m/2 - y/2, x, y);
				}
				ctx.fillStyle = win.winner.color;
				ctx.fillText(win.winner.text, 0.3 * w, 0.2 * h);
			} else {
				if (is_load === 1) {
					x = m / 4 ;
					y = ((m / 4) / image.width) * image.height;
					ctx.drawImage(image, m/2 - x/2, m/2 - y/2, x, y);
					ctx.beginPath();
					ctx.arc(center.x, center.y, center.r, 0, 2 * Math.PI, false);
					ctx.fillStyle = "rgba(120,120,80,0.3)";
					ctx.fill();
					ctx.closePath();
					//ctx.lineWidth = 10;
					//ctx.strokeStyle = win.color.arr[win.color.cur];
					//ctx.stroke();
					
					this.collection.each(function(model) {
						var view = new BallView({ctx:ctx ,model: model});
						view.render();
					});
					
					ctx.beginPath();
					ctx.arc(center.x, center.y, Math.floor(center.r / 3), 0, 2 * Math.PI, false);
					ctx.fillStyle = win.color.arr[win.color.cur];
					ctx.fill();
					ctx.closePath();
					//ctx.strokeStyle = win.color.arr[win.color.cur];
					//ctx.stroke();
					
					ctx.font = "16pt serif";
					ctx.fillStyle = "red";
					ctx.fillText("Timeout", 0.75 * w, 0.2 * h);
					ctx.fillText("00:00:" + win.timer, 0.75 * w, 0.25 * h);
					ctx.fillStyle = "black";
					ctx.fillText("Your score: " + win.score, 0.75 * w, 0.4 * h);
				}
			}
		},
		__getCursorPosition: function (e) {
			var x, y;
			//if(MOBILE) {
				//e.preventDefault();
				//x = event.touches[0].pageX;
				//y = event.touches[0].pageY;
			//}
			if (e.pageX || e.pageY) {
				x = e.pageX;
				y = e.pageY;
			} else {
				x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
				y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}
			x = x - this.el.offsetLeft;
			y = y - this.el.offsetTop;
			return {x: x, y: y};
		},
		ge____ANDROID____tCursorPosition: function (e) {
			e.preventDefault();
			var tch = e.changedTouches[0];
			if (tch.pageX || tch.pageY) {
				return {x: tch.pageX, y: tch.pageY};
			} else {
				console.log("--FuToEr--");
			}
				//x = x - this.el.offsetLeft;
			//y = y - this.el.offsetTop;
			
		},
		getCursorPosition: function (e) {
			return {
				x: e.pageX,// - this.el.offsetLeft,
				y: e.pageY// - this.el.offsetTop
			};
		},
		ev________ents: //function() {
			//return //MOBILE ?
				{
					//vmouseover:
					//vmouseout:
					"vmousedown": "mousedown",
					"vmousemove": "mousemove",
					"vmouseup": "mouseup"
					//"touchmove": "mousemove",
					//"touchstart": "mousedown",
					//"touchend": "mouseup"
				//} : 
				//{
					//"mousemove": "mousemove",
					//"mousedown": "mousedown",
					//"mouseup": "mouseup"
				//	"DOMMouseScroll": "rotate",
				//	"mousewheel": "rotate",
				//	"onmousewheel": "rotate"
				//};
		},
		events: {
			"vmousedown": "mousedown",
			"vmousemove": "mousemove",
			"vmouseup": "mouseup"
		},
		mouseup: function (e) {
			if (this.collection.length <= 0) return;
			this.collection.each(function(m) {
				if (m.has("move")) {
					m.unset("move");
					if (dentro(m.get("x"), m.get("y"), m.get("r"), center.x, center.y, Math.floor(center.r / 3))) {
						if(m.get("color") === win.color.arr[win.color.cur]) {
							m.collection.remove(m);
							win.score++;
						} else {
							m.back();
						}
					}
				}
			});
		},
		mousedown: function (e) {
			//if(win.hasOwnProperty("winner")) {
				//win.timer = 20;
				//delete win.winner;
				//c = new C();
				//c.add(win.balls);//bug
			//}
			if (this.collection.models.length <= 0) return;
			var p = this.getCursorPosition(e);
			this.collection.each(function (m) {
				if (near(p.x, p.y, m.get("x"), m.get("y"), m.get("r"))) {
					//timer = new Date();
					m.set({move: true});
				}
			});
		},
		mousemove: function (e) {// should be < 16 ms (now ~4ms)   [ < 1000/60 = 16 ]
			if (this.collection.length <= 0) return;
			
			var p = this.getCursorPosition(e);
			if (mouse){
				var collection = this.collection;
				this.collection.each(function (m) {
					if (m.has("move")) {
						m.set({
							x: m.get("x") + p.x - mouse.x,
							y: m.get("y") + p.y - mouse.y
						});
					}
				});
			}
			mouse = p;
		},
		rotate: function (e) {
			var p = mouse;
			var evt=window.event || e,
				change = 0,
				collection = this.collection;
			if( (evt.detail? evt.detail*(-120) : evt.wheelDelta) <= -120) {
				change = -1;
			} else {
				change = 1;
			}
			if (change !== 0) {
				async.forEach(
					collection.models,
					function(model) {
						if (model.has("mouse")) {
							if(model.has("childs")) {
								var rotate_angle = change * (2 * Math.PI / model.get("childs").length);
								if (model.has("rotate")) {
									model.set("rotate", model.get("rotate") + rotate_angle, {silent: true});
								} else {
									model.set("rotate", rotate_angle, {silent: true});
								}
							}
						}
					},
					null
				);
			}
		}
	});

	var c = new C();
	c.add(win.balls);
	
	var t = (function () {
		return function (callback) {
			window.setTimeout(callback, 2000);
		};
	})();
	(function ex(){
		t(ex);
		win.color.cur++;
		win.color.cur = win.color.cur % win.color.arr.length;//Math.round(Math.random()+0.2);
		win.timer--;
		if ((c.models.length === 0) && (win.timer >= 0)) {
			win.winner = {
				text: "You win",
				color: "blue"
			};
			if (is_load2 === 1) {
				win.image = image2;
			}
		}
		if((win.timer < 0)&&(c.models.length > 0)) {
			win.winner = {
				text: "Frog is winner!",
				color: "red"
			};
			if (is_load === 1) {
				win.image = image;
			}
		}
				
				
	})();
	
	var canvasView = new CanvasView({el: el, collection: c});
	
	(function() {
		var alfa = 0,
			n = c.models.length;
		c.each(function(m) {
		//async.forEach(
		//	c.models,
		//	function (m) {
				alfa = alfa + 2 * Math.PI / n;
				m.set({alfa: alfa});
				m.set("r", Math.floor(center.r / 8));
				m.back();
			}//,
			//null
		);
	})();
	
	(function animloop() {
		requestAnimFrame(animloop);
		canvasView.render();
	})();
};