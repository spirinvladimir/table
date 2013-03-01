$(document).ready(function() {

	var t0 = new Date(),
		n = 0,
		data = [
		{
			head: 1,
			name: "name",
			web: "web",
			android: "android",
			author: "author",
			date: "date"
		},
		{
			name: "Frog's balls",
			web: "frogs_balls.html",
			android: "frogs_balls.apk",
			author: "Spirin Vladimir",
			date: "21.01.2013"
		},
		{
			name: "Christmas tree",
			web: "Christmas_tree.html",
			android: "",
			author: "Spirin Vladimir",
			date: "17.01.2013"
		},
		{
			name: "SpirinTravels.com",
			web: "http://spirintravels.com",
			android: "-",
			author: "Spirin Vladimir",
			date: "01.06.2012"
		},
		{
			name: "Toledo",
			web: "http://spirinvladimir.wix.com/toledo",
			android: "",
			author: "Spirin Vladimir",
			date: "24.02.2013"
		},
		{
			name: "Deep Data",
			web: "http://prj.eu01.aws.af.cm/",
			android: "",
			author: "Spirin Vladimir",
			date: "15.01.2013"
		}
	],
	sin = function() {
			n +=  Math.PI / (4 * data.length);
			return 1200 + 7000 * Math.abs(Math.sin(n));
	};

	var M = Backbone.Model.extend({});

	var C = Backbone.Collection.extend({
		model: M
	});
	
	var AView = Backbone.View.extend({
		initialize : function () {
			this.el.setAttribute("href", this.options.value);
			this.el.appendChild(document.createTextNode(this.options.value));
		}
	});
	
	var TdView= Backbone.View.extend({
		initialize : function () {
			//this.el.style.backgroundColor = "black";
			//this.el.style.height = "50px";
			//this.el.setAttribute("align", "center");
			this.el.style.display = 'none';
			//this.show(this.options.key, this.options.value);
			//var k = this.options.key,
			//	v = this.options.value;
			var _this = this,
				t = new Date();
			window.setTimeout(
				function(){_this.show(_this.options.key, _this.options.value);},
				sin()
			);
		},
		show: function (key, value) {
			
			this.el.style.backgroundColor = "rgba(120,100,100,0.8)";
			this.$el.fadeIn("slow");
			
			if((key === "web") || (key === "android")) {
				var aView = new AView({tagName: "a", value: value});
				this.el.appendChild(document.createElement("h2")).appendChild(aView.el);
			} else {
				this.el.appendChild(document.createElement("h2")).appendChild(document.createTextNode(value));
			}
		},
		events: {
			"mouseover": "mouseover",
			"mouseout": "mouseout"
		},
		mouseover: function (e) {
			this.el.style.backgroundColor = "rgba(70,50,50,0.8)";
			this.$el.fadeIn("slow");
		},
		mouseout: function (e) {
			this.el.style.backgroundColor = "rgba(120,100,100,0.8)";
			this.$el.fadeIn("slow");
		}
	});
	
	var ThView= Backbone.View.extend({
	initialize : function () {
			//this.el.style.backgroundColor = "black";
			//this.el.style.height = "50px";
			this.el.style.display = 'none';
			//this.show(this.options.key, this.options.value);
			//var k = this.options.key,
			//	v = this.options.value;
			var _this = this;
			window.setTimeout(
				function(){_this.show(_this.options.value);},
				sin()
			);
		},
		show: function (value) {
			
			this.$el.fadeIn("slow");
			this.el.style.backgroundColor = "rgba(70,50,50,0.4)";
			this.$el.fadeIn("slow");
			
			
			this.el
					.appendChild(document.createElement("h2"))
					.appendChild(document.createTextNode(value));
		},
		events: {
			"mouseover": "mouseover",
			"mouseout": "mouseout"
		},
		mouseover: function (e) {
			var _el = this.el;
			setTimeout(function(){
				_el.style.backgroundColor = "rgba(120,100,100,0.4)";
			}, 400);
		},
		mouseout: function (e) {
			this.el.style.backgroundColor = "rgba(70,50,50,0.4)";
		}
	});
	
	var TrView= Backbone.View.extend({
		initialize : function () {
			var model = this.model;
			var el = this.el;
			
			async.forEach(
				_.map(model.attributes,function(a,b){return {value: a, key: b};}),
				function (att) {
					var tdView = new TdView({tagName: "td", value: att.value, key: att.key});//className: "fade", 
					el.appendChild(tdView.el);
				},
				null
			);
		}
	});
	
	var Tr_head_View= Backbone.View.extend({
		initialize : function () {
			var model = this.model;
			var el = this.el;
			
			async.forEach(
				_.map(model.attributes,function(a,b){return {value: a, key: b};}),
				function (att) {
					if(att.key !== "head") {
						var tdView = new ThView({tagName: "th", value: att.value});
						el.appendChild(tdView.el);
					}
				},
				null
			);
		}
	});
	
	var TheadView= Backbone.View.extend({
		initialize: function() {
			var el = this.el;
			async.forEach(
				this.collection.where({head: 1}),
				function(m) {
					var trView = new Tr_head_View({tagName: "tr", model: m});
					el.appendChild(trView.el);
				},
				null
			);
		}
	});
	
	var TbodyView= Backbone.View.extend({
		initialize: function() {
			var el = this.el;
			async.forEach(
				this.collection.models,
				function(m) {
					if(!m.has("head")) {
						var trView = new TrView({tagName: "tr", model: m});
						el.appendChild(trView.el);
					}
				},
				null
			);
		}
	});
	
	var CaptionView= Backbone.View.extend({
		initialize: function() {
			var NavbarView= Backbone.View.extend({
				initialize: function() {
					var NavbarinnerView= Backbone.View.extend({
						initialize: function() {
							var ContainerView= Backbone.View.extend({
								initialize: function() {
									var BrandView= Backbone.View.extend({
										initialize: function() {
											this.el.appendChild(document.createTextNode("// Spirin Vladimir"));
										}
									});
									var brandView = new BrandView({tagName: "a", className: "brand"});
									this.el.appendChild(brandView.el);
								}
							});
							var containerView = new ContainerView({className: "container"});
							this.el.appendChild(containerView.el);
						}
					});
					var navbarinnerView = new NavbarinnerView({className: "navbar-inner"});
					this.el.appendChild(navbarinnerView.el);
				}
			});
			var navbarView = new NavbarView({className: "navbar navbar-inverse"});
			this.el.appendChild(navbarView.el);
		}
	});
	
	var TableView= Backbone.View.extend({
		initialize: function() {
			var el = this.el;
			
			this.el.setAttribute('height', Math.max(Math.floor(0.9 * window.innerHeight), document.body.clientHeight));
			
			var c = new C();
			c.add(data);
			
			async.forEach(
				['thead', 'tbody', 'caption'],
				function(f) {
					if(f === 'thead') {
						var xView = new TheadView({tagName: "thead", collection: c});
					} else if (f=== 'tbody') {
						var xView = new TbodyView({tagName: "tbody", collection: c});
					} else {
						var xView = new CaptionView({tagName: "caption"});
					}
					el.appendChild(xView.el);
				},
				null
			);
		}
	});
	
	var tableView = new TableView({tagName: "table", className: "table table-bordered"});
	document.body.appendChild(tableView.el);
});
