# List of that I'm doing stored in one table #

## Used:

  * Bootstrap (table)
  * Backbone.js (views)
  * Async.js
  * ...

## Style of coding:

```js
...
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
...
```

&copy; Spirin Vladimir
