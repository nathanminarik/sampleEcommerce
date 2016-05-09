var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejsMate = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var MongoStore = require('connect-mongo/es5')(session);
var passport = require('passport');


var secret = require('./config/secret')
// require our schema
var User = require('./models/user');



var app = express();

mongoose.connect(secret.database, function(err){
	if (err) {
		console.log('Database Error')
	} else {
		console.log('Connected to the database');
	}
});

app.use(express.static(__dirname + '/public'))
// Start middleware
app.use(morgan('dev'));

// Body parser allows express to parse specified data types
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: secret.secretKey,
	store: new MongoStore({url: secret.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});

// EJS
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

// End Middleware
var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user')

app.use(mainRoutes);
app.use(userRoutes);

app.listen(secret.port, function(err){
	if (err) throw err;
	console.log('Server is running on port ' + secret.port);
});
