// app/routes.js
module.exports = function(app, passport) {

    // =====================================
    // Event Planning (with timeline) ========
    // =====================================
    app.get('/event_planning', function(req, res) {
        res.render('event_planning.ejs'); // load the index.ejs file
    });

    // =====================================
    // Index HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { 
            message: req.flash('loginMessage') 
        }); 
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
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
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/signup_profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // Sign Up create club(fill in club info page)=======
    // =====================================
    // show the signup form
    app.get('/signup_create_club', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup_create_club.ejs');
    });

    // =====================================
    // Sign Up profile(fill in profile page)=======
    // =====================================
    // show the signup form
    app.get('/signup_profile', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup_profile.ejs');
    });

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