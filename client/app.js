const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes/index.js');
const engine = require('consolidate');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');

app.set('trust proxy', 1);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.engine('html', engine.mustache);
app.set('view engine', 'html');


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
    return res.status(200).json({});
  }
  next();
});


app.use(session({
  name: 'session',
  keys: ['secret keys'],
  resave: true,
  saveUninitialized: false,
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));



app.use("/", routes);


//error handler middleware-1
//tangkap not found request, teruskan ke middleware-2
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

//error handler middleware-2
//tangkap not found request dari middleware-1, keluarkan di halaman error
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: "Error",
    status: err.status
  	});
  console.log(res.statusCode);
});


const port = process.env.port || 3001;
app.listen(port, () => {
	console.log("CLIENT, running on 127.0.0.1:" + port);
})