// server.js
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 6060;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var path = require('path');
var AWS = require('aws-sdk'); 
AWS.config.region = 'us-west-2'; 
var s3 = new AWS.S3();
s3.listBuckets(function(err, data) {
  if (err) { console.log("Error:", err); }
  else {
    for (var index in data.Buckets) {
      var bucket = data.Buckets[index];
      console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
    }
  }
})



var mysql        = require("mysql");
var con = mysql.createConnection({
  host: "groop1.ctrhjjzjrs0h.us-west-2.rds.amazonaws.com",
  user: "groopdb",
  password: "11235813",
  database: "mydb",
  port:"3306"
});

con.connect(function(err){
  if(err){
  	console.log('err');
    console.log('Error connecting to Db groopdb');
    return;
  }
  console.log('Connection established');
});

con.end(function(err) {
  if(err){
    console.log('Error terminate Db ');
    return;
  }
  console.log('Connection terminate');
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});

//var configDB = require('./config/database.js');

// configuration ===============================================================
// mongoose.connect(configDB.url); // connect to our database



require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms
app.set('view engine', 'ejs'); // set up ejs for templating
//timeline style
app.use(express.static(path.join(__dirname,'public')));
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./app/insert_profile.js')(app); // 
//require('./app/eventData.js')(app);
// launch ======================================================================
app.listen(port);
/*app.listen = function(){
  var server = http.createServer(this);
  return server.listen.apply(server, arguments);
};*/
console.log('The magic happens on port ' + port);