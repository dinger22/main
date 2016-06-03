// app/routes.js
var mysql        = require("mysql");
var connection  = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "11235813",
    database: "mydb"
});

module.exports = function(app, passport) {

    // =====================================
    // Event Planning (with timeline) ========
    // =====================================
    app.get('/event_planning', function(req, res) {
        var tasks_list;
        var load_event_number = parseInt(req.url.slice(-1));
        connection.query("SELECT * FROM tasks where Events_idEvents = ?",[load_event_number || 1] ,function(err,rows1){
            console.log(rows1);
            console.log("above row object");
            if (err){
                return;
            }
            if (rows1.length) {
                var l_task = rows1.length;
                var ex_tasks_id = [],
                    ex_tasks_content = [],
                    ex_tasks_Description = [],
                    ex_tasks_Assignee = [],
                    ex_tasks_Status = [],
                    ex_tasks_time = [];
                for (var index = 0; index < l_task; index++) {
                    var des = rows1[index].Description == null ? "":rows1[index].Description.toString(),
                       assi = rows1[index].Assignee == null ? "":rows1[index].Assignee.toString(); 
                    ex_tasks_id.push(rows1[index].idTasks.toString());
                    ex_tasks_content.push(rows1[index].Task_name.toString());
                    ex_tasks_Description.push(des+"*Description*");
                    ex_tasks_Assignee.push(assi+"*Assignee*");
                    ex_tasks_Status.push(rows1[index].Status.toString());
                    ex_tasks_time.push(rows1[index].Due_date.toString());
                }
                ex_tasks_id = ex_tasks_id.toString();
                ex_tasks_content = ex_tasks_content.toString();
                ex_tasks_time = ex_tasks_time.toString();
                ex_tasks_Description = ex_tasks_Description.toString();
                ex_tasks_Assignee = ex_tasks_Assignee.toString();
                ex_tasks_Status = ex_tasks_Status.toString();
            }
            //console.log(rows1);
            connection.query("SELECT * FROM expense where Events_idEvents = 1" ,function(err,rows2){
                if (err){
                    console.log("error tasks");
                    return;
                }
                if (rows2.length) {
                var l_pay = rows2.length;
                var ex_pay_id = [],
                    ex_pay_entry = [],
                    ex_pay_type = [],
                    ex_pay_time = [],
                    ex_pay_Status = [],
                    ex_pay_amount = [];

                for (var index = 0; index < l_pay; index++) {
                    ex_pay_id.push(rows2[index].idAccounting.toString());
                    ex_pay_entry.push(rows2[index].Entry_name.toString());
                    ex_pay_type.push(rows2[index].Type.toString()+"*TYPE*");
                    ex_pay_time.push(rows2[index].DateTime.toString());
                    ex_pay_Status.push(rows2[index].Status.toString());
                    ex_pay_amount.push(rows2[index].Amount.toString());
                }
                ex_pay_id = ex_pay_id.toString();
                ex_pay_entry = ex_pay_entry.toString();
                ex_pay_amount = ex_pay_amount.toString();
                ex_pay_type = ex_pay_type.toString();
                ex_pay_time = ex_pay_time.toString();
                ex_pay_Status = ex_pay_Status.toString();
                res.render('event_planning.ejs',{
                    ex_tasks_id : ex_tasks_id,
                    ex_tasks_content : ex_tasks_content,
                    ex_tasks_time : ex_tasks_time, //get the user information
                    ex_tasks_Description : ex_tasks_Description,
                    ex_tasks_Assignee : ex_tasks_Assignee, //get the user information 
                    ex_tasks_Status : ex_tasks_Status,
                    ex_pay_id : ex_pay_id,
                    ex_pay_time : ex_pay_time,
                    ex_pay_entry : ex_pay_entry,
                    ex_pay_type : ex_pay_type,
                    ex_pay_Status : ex_pay_Status,
                    ex_pay_amount : ex_pay_amount //get the user information 
                });
            }
            });
        });

    });
    app.post('/event_planning', function(req, res){
        if (req.body.actionType == "edit"){
            if (req.body.amount == null){
                connection.query("UPDATE tasks SET Task_name = ?,Due_date = ?, Description = ?, Assignee = ? WHERE idTasks = ?",[req.body.Task_name,req.body.Due_date,req.body.Description,req.body.Asignee,req.body.taskID],function(err,rows){
                    if (err)
                        console.log(err);
                    else{
                        connection.query("SELECT Events_idEvents FROM tasks where idTasks = ?",[req.body.taskID],function(err,idEvents){
                            var event_number = idEvents[0].Events_idEvents;
                            res.writeHead(303, { Location : req.url+"?event_number="+event_number });
                            res.end();
                        });
                    }
                });
            }
            else{
                connection.query("UPDATE expense SET Entry_name = ?,Type = ?, Amount = ? WHERE idAccounting = ?",[req.body.title_pay,req.body.title,req.body.amount,req.body.payID],function(err,rows){
                    if (err)
                        console.log(err);
                    else{
                        connection.query("SELECT Events_idEvents FROM expense where idAccounting = ?",[req.body.payID],function(err,idEvents){
                            var event_number = idEvents[0].Events_idEvents;
                            res.writeHead(303, { Location : req.url+"?event_number="+event_number });
                            res.end();
                        });
                    }
                });   
            }
        }
        else if (req.body.actionType == "set_complete" || req.body.actionType == "set_uncomplete"){
            var complete_or_uncomplete = req.body.actionType == "set_complete" ? 1 : 0;
            if (req.body.payID == null){
                connection.query("UPDATE tasks SET Status = ? WHERE idTasks = ?",[complete_or_uncomplete, req.body.taskID],function(err,rows){
                    if (err)
                        console.log(err);
                    else{
                        connection.query("SELECT Events_idEvents FROM tasks where idTasks = ?",[req.body.taskID],function(err,idEvents){
                            var event_number = idEvents[0].Events_idEvents;
                            res.writeHead(303, { Location : req.url+"?event_number="+event_number });
                            res.end();
                        });
                    }
                });
            }
            else{
                connection.query("UPDATE expense SET Status = ? WHERE idAccounting = ?",[complete_or_uncomplete,req.body.payID],function(err,rows){
                    if (err)
                        console.log(err);
                    else{
                        connection.query("SELECT Events_idEvents FROM expense where idAccounting = ?",[req.body.payID],function(err,idEvents){
                            var event_number = idEvents[0].Events_idEvents;
                            res.writeHead(303, { Location : req.url+"?event_number="+event_number });
                            res.end();
                        });
                    }
                });   
            }

        }
        else{
            if (req.body.id == "post_form"){
                connection.query("SELECT * FROM tasks WHERE Task_name = '"+req.body.Task_name+"'",function(err,rows){
                    console.log(rows);
                    console.log("above row object");
                    if (err)
                        console.log(err);
                    if (rows.length) {
                        console.log("name taken");
                    } 
                    else {
                        // if there is no user with that name
                        // create the task
                        var newTask = new Object();
                        
                        newTask.Task_name    = req.body.Task_name;
                        newTask.Description    = req.body.Description;
                        newTask.Asignee    = req.body.Asignee;
                        newTask.Due_date    = req.body.Due_date;
                         // use the generateHash function in our user model
                        var insertQuery = "INSERT INTO tasks ( Description, Events_idEvents,Task_name, Assignee, Due_date, Status) VALUES ('" + newTask.Description + "','" + 1 +"','"+ req.body.Task_name  +"','"+ req.body.Asignee +"','"+ req.body.Due_date+"','"+ 0 +"')";
                        connection.query(insertQuery,function(err,rows){
                            //newUserMysql.idClub = rows.insertId;
                            if (err){
                                console.log(err);
                                console.log("task error");
                            }else{
                                connection.query("SELECT Events_idEvents FROM tasks where Task_name = ?",[newTask.Task_name],function(err,idEvents){
                                    var event_number = idEvents[0].Events_idEvents;
                                    res.writeHead(303, { Location : req.url+"?event_number="+event_number });
                                    res.end();
                                });
                            }

                        }); 
                    }   
                });
            }
            else{
                connection.query("SELECT * FROM expense WHERE Entry_name = '"+req.body.title_pay+"'",function(err,rows){
                    //console.log(rows);
                    console.log("above row object");
                    if (err)
                        console.log(err);
                    if (rows.length) {
                        console.log("name taken");
                    } 
                    else {
                        // if there is no user with that name
                        // create the task
                        var newPay = new Object();
                        
                        newPay.title_pay    = req.body.title_pay;
                        newPay.title    = req.body.title;
                        newPay.amount    = req.body.amount;
                        newPay.pay_time    = req.body.pay_time;
                         // use the generateHash function in our user model
                        var insertQuery = "INSERT INTO expense (Entry_name,Events_idEvents,Type, Amount,DateTime,Status) VALUES ('" + newPay.title_pay + "','" + 1 +"','"+ newPay.title  +"','"+ newPay.amount +"','"+ newPay.pay_time+"','" + 0 +"')";
                        connection.query(insertQuery,function(err,rows){
                            //newUserMysql.idClub = rows.insertId;
                            if (err){
                                console.log(err);
                                console.log("task error");
                            }else{
                                connection.query("SELECT Events_idEvents FROM expense where Entry_name = ?",[newPay.title_pay],function(err,idEvents){
                                    var event_number = idEvents[0].Events_idEvents;
                                    res.writeHead(303, { Location : req.url+"?event_number="+event_number });
                                    res.end();
                                });
                            }

                        }); 
                    }   
                });

            }
        }
        
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