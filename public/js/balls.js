$(document).ready(function() {

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

	io.connect('http://localhost').on('c', function (data) {
		var center,
			nL = 0,
			el = document.createElement("canvas");
		
		document.body.appendChild(el);
		
		var CanvasView = Backbone.View.extend({
			initialize: function() {
				this.resize();
				this.options.ctx = this.el.getContext("2d");
			},
			resize: function() {
				var w = document.body.clientWidth;//document.getElementById('a').width;
				var h = Math.max(Math.floor(0.9 * window.innerHeight), document.body.clientHeight);
				if(w > h) {
					console.log("window.screenY = " + window.screenY);
					console.log("window.outerHeight = " + window.outerHeight);
					console.log("window.innerHeight = " + window.innerHeight);
					
					console.log("window.screenY = " + window.screenY);
					console.log("w = " + w);
					console.log("h = " + h);
					
					el.width = h;
					el.height = h;//Math.floor(0.9 * $(window).height());
					
					this.$el.offset({left: (w / 2) - (h / 2), top: 0});
					
					center = {
					r: h / 2,
					x: h / 2,
					y: h / 2
				};
				}
			},
			render: function() {
				//var ctx = ;//,
				//	w = this.el.width,
				//	h = this.el.height,
				//	m = Math.min(w, h);
					
				//doesn't have to clean
				this.options.ctx.clearRect(0, 0, this.$el.width(), this.$el.height());
				
				this.collection.where({top: 1})[0].get("view").r_render(this.options.ctx);
				
				//var view=new BallView({ctx: ctx, model: this.collection.where({top: 1})[0]});
				//view.r_render();
				var m = this.collection.where({mouse: true}).pop();
				if (m) {
					m.get("view").r_render(this.options.ctx);
				}
				//this.collection.each(function(model) {
				//	if (model.has("mouse")) {
				//		model.get("view").r_render(this.options.ctx);
				//	}
				//});
			},
			getCursorPosition: function (e) {
				var x, y;
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
			near: function (x, y, ax, ay, r) {
				if (Math.pow(x - ax, 2) + Math.pow(y - ay, 2) <= Math.pow(r, 2)) {
					return 1;
				} else {
					return 0;
				}
			},
			events: {
				"mousemove": "mousemove",
				"DOMMouseScroll": "rotate",
				"mousewheel": "rotate",
				"onmousewheel": "rotate"
			},
			mousemove: function (e) {// should be < 16 ms (now ~4ms)   [ < 1000/60 = 16 ]
				if (this.collection.length <= 0) {
					return;
				}
				
				var p = this.getCursorPosition(e),
					collection = this.collection;
				
				if (0 === this.near(p.x, p.y, center.x, center.y, center.r)) {
					//delete "mouse" for all
					async.forEach(
						collection.where({mouse: true}),
						function (m) {
							m.unset("mouse", {silent: true});
							m.get("view").$el.fadeOut();
						},
						null
					);
					// set mouse to top
					collection.where({top: 1})[0].set("mouse", true);//, {silent: true});
					//collection.where({top: 1})[0].center();
				} else {
					if (collection.where({mouse: true}).length <=0) {
						// set mouse to top
						collection.where({top: 1})[0].set("mouse", true);//, {silent: true});
						//collection.where({top: 1})[0].center();
					} else {
						//main logic start
						var model = collection.where({mouse: true})[0],
							find = 0;
						
						if (model.has("childs")) {
							var near = this.near;
							async.forEach(
								model.get("childs"),
								function (id) {
									if (find === 0) {
										var child_model = collection.get(id);
										if (near(p.x, p.y, child_model.get("x"), child_model.get("y"), child_model.get("r"))) {
											//delete "mouse" for all
											async.forEach(
												collection.where({mouse: true}),
												function (m) {
													m.unset("mouse", {silent: true});
													m.get("view").$el.fadeOut();
												},
												null
											);
											//set "mouse" for current child
											child_model.set("mouse", true);//, {silent: true});
											//child_model.center();
											find = 1;// break
											
										}
									}
								},
								null
							);
						}
						if (find === 0) {
							if (0 === this.near(p.x, p.y, model.get("x"), model.get("y"), model.get("r"))) {
								//delete "mouse" for all
								async.forEach(
									collection.where({mouse: true}),
									function (m) {
										m.unset("mouse", {silent: true});
										m.get("view").$el.fadeOut();
									},
									null
								);
								collection.where({top: 1})[0].set("mouse", true, {silent: true});//, {silent: true});
								//collection.where({top: 1})[0].center();
							}
						}
						//main logic end
					}
				}
			},
			rotate: function (e) {
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
		
		var canvasView = new CanvasView({el: el});
	
		var IM = Backbone.Model.extend({});
		
		var CIM = Backbone.Collection.extend({
			model: IM
		});
		
		var BallView= Backbone.View.extend({
			initialize: function() {
				var view = new Backbone.View;
				var h3 = document.createElement("h3");
				var badge = view.make("span", {"class": "badge badge-inverse"});
				h3.appendChild(document.createTextNode(this.model.get("id")));
				badge.appendChild(h3);
				this.el.appendChild(badge);
				this.el.style.display = 'none';
				document.body.appendChild(this.el);
			},
			render : function(ctx) {
					ctx.beginPath();
					ctx.arc(this.model.get("x"), this.model.get("y"), this.model.get("r"), 0, 2 * Math.PI, false);
					ctx.fillStyle = this.model.get("color");
					ctx.fill();
					ctx.closePath();
					
					if (this.model.has("show_title")) {
						this.$el.offset({
							left: canvasView.$el.offset().left + this.model.get("x") - this.model.get("r"),
							top: canvasView.$el.offset().top + this.model.get("y") + this.model.get("r")
						});
						this.$el.fadeIn();
					}
					
					if (this.model.has("mouse")) {
						ctx.stroke();
						//this.$el.offset({
						//	left: canvasView.$el.offset().left + this.model.get("x") + this.model.get("r"),
						//	top: canvasView.$el.offset().top + this.model.get("y")
						//});
						//this.$el.fadeIn();
						
						if ((nL === 0) && this.model.has("img")) {
							var a = 0.5 * Math.sqrt(2) * this.model.get("r");
							ctx.drawImage(
								cIM.get(this.model.get("img")).get("img"),
								this.model.get("x") - (a / 2),
								this.model.get("y") - (a / 2),
								a,
								a
							);
						}
					}
			},
			r_render : function(ctx) {
				var model = this.model;
				if(this.model.get("draw")) {
					this.render(ctx);
					if (model.has("childs")) {
						var childs = model.get("childs");
						async.forEach(
							childs,
							function(id) {
								var child_model = model.collection.get(id);
								child_model.get("view").r_render(ctx);
							},
							null
						);
					}
				}
			}
		});
		
		var Ball = Backbone.Model.extend({
			initialize: function() {
				this.set({view: new BallView({model: this, className: ""})}, {silent: true});
			},
			defaults: {
				"x": center.x,
				"y": center.y,
				"r": center.r,
				"draw": true,
				"alfa": 0
			},
			son : function(r, x, y, n) {
				this.set("to_r", Math.floor(r / n));
				this.set("to_x", x + Math.floor((3 * r / n) * Math.cos(this.get("alfa"))));
				this.set("to_y", y - Math.floor(3 * (r / n) * Math.sin(this.get("alfa"))));
				//this.set("timer", new Date());
				
				if (!this.has("x")) {
					this.set("x", this.get("to_x"));
				}
				if (!this.has("y")) {
					this.set("y", this.get("to_y"));
				}
				if (!this.has("r")) {
					this.set("r", this.get("to_r"));
				}
			},
			center: function() {
				if(this.has("childs")){
					this.set("to_r", center.r);
				} else {
					this.set("to_r", Math.floor(0.8 * center.r));
				}
				this.set("to_x", center.x);
				this.set("to_y", center.y);
				
				
				//this.set("timer", new Date());
			},
			go: function() {
				// f(x) = to_x - x     => 0
				// x = to_x -f(x);
				// f(x)     => to_x
				
				// f1(x) = +- x           with [x0 : f2(x0) = to_x] (lineal depend)
				// f2(x) = +- x*sin(x) with [x0 : f2(x0) = to_x] (not lineal)
				var x = this.get("x");
				var to_x = this.get("to_x");
				var y = this.get("y");
				var to_y = this.get("to_y");
				var r = this.get("r");
				var to_r = this.get("to_r");
				//var t0 = this.get("timer");
				
				if (x < to_x) {
					x++;
					this.set("x", x);
				}
				if (x > to_x) {
					x--;
					this.set("x", x);
				}
				if (y < to_y) {
					y++;
					this.set("y", y);
				}
				if (y > to_y) {
					y--;
					this.set("y", y);
				}
				if (r < to_r) {
					r++;
					
					//var a = this.get("color").split(",");
					//a.pop();
					//a.push((1.2 * r / center.r) + ")");
					//this.set("color", a.join(","), {silent: true});
					
					this.set("r", r);
				}
				if (r > to_r) {
					if (r > 1) {
						r--;
					}
					
					//var alfa = ();// this.get("color").split(",").pop().split("").reverse().join("").substring(1).split("").reverse().join("") ;
					//var a = this.get("color").split(",");
					//a.pop();
					//a.push((1.2 * r / center.r) + ")");
					//this.set("color", a.join(","), {silent: true});
					
					this.set("r", r);
				}
			}
		});
	
		var C = Backbone.Collection.extend({
			model: Ball
		});
	
		var tree = function(model) {
			model.go();
			if (model.has("childs")) {
				var childs = model.get("childs");
				var alfa = 0;
				if(model.has("rotate")) {
					alfa = model.get("rotate");
				}
				async.forEach(
					childs,
					function(id) {
						var child_model = model.collection.get(id);
						
						alfa = alfa + 2 * Math.PI / childs.length;
						
						child_model.set("alfa", alfa);
						
						if (child_model.has("mouse")) {
							child_model.center();
						} else {
							child_model.son(
								model.get("r"),
								model.get("x"),
								model.get("y"),
								4
							);
						}
						
						if (model.has("mouse")) {
							child_model.set({show_title: true}, {silent: true});
						} else {
							child_model.unset("show_title", {silent: true});
							child_model.get("view").$el.fadeOut('slow');
						}
						
						tree(child_model);
					},
					null
				);
			}
		}
			
		
		
		var c = new C();
		var cIM = new CIM();
	
		var i;
		for (i = 0; i < data.c.length; i++) {
			if(data.c[i].hasOwnProperty("img")) {
				var imgObj = new Image();
				imgObj.onload = function(){nL--};
				nL++;
				imgObj.src = data.c[i].img;
				var iM = new IM({img: imgObj});
				data.c[i].img = iM.cid;
				cIM.add(iM);
			}
			c.add(data.c[i]);
		}
		
		canvasView.collection = c;
		
		(function animloop() {
			requestAnimFrame(animloop);
			document.body.clientHeight = canvasView.el.width;
			async.parallel([
				tree(c.where({top: 1})[0]),
				canvasView.render()
			]);
		})();
	});
});
