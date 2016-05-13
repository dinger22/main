// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // Event Planning (with timeline) ========
    // =====================================
    app.get('/event_planning', function(req, res) {
        res.render('event_planning.ejs'); // load the index.ejs file
    });
    app.post('/event_planning', function(req, res){

        var mysql        = require("mysql");
        var connection  = mysql.createConnection({
            host: "aa4spqyqzp9zds.ctrhjjzjrs0h.us-west-2.rds.amazonaws.com",
            user: "dingy22",
            password: "11235813",
            database: "test"
        });
        connection.query("UPDATE users SET data = ? Where email = 'test6@test.com'",[req.body.title],function(err){
            if(err){
                console.log("baaaaaaaaaaaaaaaaaaaaaaaaaaad");
                res.status(500).end();
                return;
            }
            console.log("gooooooooooooooooooooood");
            res.render('event_planning.ejs');
            return;
        });
        connection.end(function(err) {
          if(err){
            console.log('Error terminate Db ');
            return;
          }
          console.log('Connection terminate');
          return;
          // The connection is terminated gracefully
          // Ensures all previously enqueued queries are still
          // before sending a COM_QUIT packet to the MySQL server.
        });
        
    });

    // =====================================
    // Index HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs',{ 
            message: req.flash('message') 
        }); // load the index.ejs file
    });
    app.get('/index', function(req, res) {
        res.render('index.ejs',{ 
            message: req.flash('message') 
        }); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('index.ejs', { 
            message: req.flash('message') 
        }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/index', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // Profile==============================
    // =====================================
    app.get('/profile', function(req, res) {
        res.render('profile.ejs',{
            user : req.user //get the user information 
        }); 
    });

    // =====================================
    // Sign Up (main sign up page)==========
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('index.ejs', { message: req.flash('message') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/signup_profile', // redirect to the secure profile section
        failureRedirect : '/index', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));






    

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}