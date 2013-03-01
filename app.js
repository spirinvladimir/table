var connect = require('connect'),
	http = require('http'),
	app = connect()
		.use(connect.favicon())
		.use(connect.logger('dev'))
		.use(connect.static('public'))
		.use(connect.directory('public'))
		.use(connect.cookieParser())
		.use(connect.limit('200kb'))
		.use(connect.session({ secret: '0101' }))
		.use(function(req, res){
			res.end('Hello from Connect!\n');
		}),
	server = http.createServer(app).listen(process.env.VCAP_APP_PORT || 3000);