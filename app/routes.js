// app/routes.js
var mysql        = require("mysql");
var connection  = mysql.createConnection({
  host: "groop1.ctrhjjzjrs0h.us-west-2.rds.amazonaws.com",
  user: "groopdb",
  password: "11235813",
  database: "mydb",
  port:"3306"
});

module.exports = function(app, passport) {

    // =====================================
    // Event Planning (with timeline) ========
    // =====================================
    app.get('/event_planning', function(req, res) {
        var tasks_list;
        var load_event_number = parseInt(req.url.slice(-1));
        var name_taken = req.url.search("name_taken");
        var message = '';
        if (name_taken != -1){
            message = "This task or expense's name is already taken in this event.";
        }
        connection.query("SELECT * FROM tasks where Events_idEvents = ?",[load_event_number] ,function(err,rows1){
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
            connection.query("SELECT * FROM expense where Events_idEvents = ?",[load_event_number],function(err,rows2){
                if (err){
                    console.log("error tasks");
                    return;
                }
                if (rows2.length || rows1.length) {
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
                        ex_tasks_id : ex_tasks_id || "",
                        ex_tasks_content : ex_tasks_content || "",
                        ex_tasks_time : ex_tasks_time || "", //get the user information
                        ex_tasks_Description : ex_tasks_Description || "",
                        ex_tasks_Assignee : ex_tasks_Assignee || "", //get the user information 
                        ex_tasks_Status : ex_tasks_Status || "",
                        ex_pay_id : ex_pay_id || "",
                        ex_pay_time : ex_pay_time || "",
                        ex_pay_entry : ex_pay_entry || "",
                        ex_pay_type : ex_pay_type || "",
                        ex_pay_Status : ex_pay_Status || "",
                        ex_pay_amount : ex_pay_amount  || "",//get the user information
                        current_event_number : load_event_number,
                        message : message 
                    });
                }
                else{
                    res.render('event_planning.ejs',{
                        ex_tasks_id : '',
                        ex_tasks_content : '',
                        ex_tasks_time : '', //get the user information
                        ex_tasks_Description : '',
                        ex_tasks_Assignee : '', //get the user information 
                        ex_tasks_Status : '',
                        ex_pay_id : '',
                        ex_pay_time : '',
                        ex_pay_entry : '',
                        ex_pay_type : '',
                        ex_pay_Status : '',
                        ex_pay_amount : '', //get the user information 
                        current_event_number : load_event_number,
                        message : message
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
            if (req.body.title_pay == null){
                connection.query("SELECT * FROM tasks WHERE Task_name = '"+req.body.Task_name+"' AND Events_idEvents = '"+req.body.eventID+"'",function(err,rows){
                    console.log(rows);
                    console.log("above row object");
                    if (err)
                        console.log(err);
                    if (rows.length) {
                        // res.render('event_planning.ejs',{
                        //     ex_tasks_id : '',
                        //     ex_tasks_content : '',
                        //     ex_tasks_time : '', //get the user information
                        //     ex_tasks_Description : '',
                        //     ex_tasks_Assignee : '', //get the user information 
                        //     ex_tasks_Status : '',
                        //     ex_pay_id : '',
                        //     ex_pay_time : '',
                        //     ex_pay_entry : '',
                        //     ex_pay_type : '',
                        //     ex_pay_Status : '',
                        //     ex_pay_amount : '', //get the user information 
                        //     current_event_number : load_event_number,
                        //     message : 'This task name is already taken in this event.' 
                        // });

                        res.writeHead(303, { Location : req.url+"?name_taken_event_number="+req.body.eventID, message : "name taken" });
                        res.end();  
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
                        var insertQuery = "INSERT INTO tasks ( Description, Events_idEvents,Task_name, Assignee, Due_date, Status) VALUES ('" + newTask.Description + "','" + req.body.eventID +"','"+ req.body.Task_name  +"','"+ req.body.Asignee +"','"+ req.body.Due_date+"','"+ 0 +"')";
                        connection.query(insertQuery,function(err,rows){
                            //newUserMysql.idClub = rows.insertId;
                            if (err){
                                console.log(err);
                                console.log("task error");
                            }else{
                                // connection.query("SELECT Events_idEvents FROM tasks where Task_name = ?",[newTask.Task_name],function(err,idEvents){
                                    // var event_number = idEvents[0].Events_idEvents;
                                    res.writeHead(303, { Location : req.url+"?event_number="+req.body.eventID });
                                    res.end();
                                // });
                            }

                        }); 
                    }   
                });
            }
            else{
                connection.query("SELECT * FROM expense WHERE Entry_name = '"+req.body.title_pay+"' AND Events_idEvents = '"+req.body.eventID+"'",function(err,rows){
                    //console.log(rows);
                    console.log("above row object");
                    if (err)
                        console.log(err);
                    if (rows.length) {
                        res.render('event_planning.ejs',{
                            ex_tasks_id : '',
                            ex_tasks_content : '',
                            ex_tasks_time : '', //get the user information
                            ex_tasks_Description : '',
                            ex_tasks_Assignee : '', //get the user information 
                            ex_tasks_Status : '',
                            ex_pay_id : '',
                            ex_pay_time : '',
                            ex_pay_entry : '',
                            ex_pay_type : '',
                            ex_pay_Status : '',
                            ex_pay_amount : '', //get the user information 
                            current_event_number : load_event_number,
                            message : 'This entry name is already taken in this event' 
                        });  
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
                        var insertQuery = "INSERT INTO expense (Entry_name,Events_idEvents,Type, Amount,DateTime,Status) VALUES ('" + newPay.title_pay + "','" + req.body.eventID +"','"+ newPay.title  +"','"+ newPay.amount +"','"+ newPay.pay_time+"','" + 0 +"')";
                        connection.query(insertQuery,function(err,rows){
                            //newUserMysql.idClub = rows.insertId;
                            if (err){
                                console.log(err);
                                console.log("task error");
                            }else{
                                // connection.query("SELECT Events_idEvents FROM expense where Entry_name = ?",[newPay.title_pay],function(err,idEvents){
                                    // var event_number = idEvents[0].Events_idEvents;
                                    res.writeHead(303, { Location : req.url+"?event_number="+req.body.eventID });
                                    res.end();
                                // });
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
        var select_club_query = "SELECT Role, Club_idClub, Club_Name, Display_name FROM organizer_team o, user u, membership m, club c WHERE u.idUser = " + req.user.idUser + " and m.User_idUser = u.idUser "+" and m.Club_idClub = c.idClub"+" and o.User_idUser = u.idUser";
        connection.query(select_club_query,function(err,rows_club){
            var club_idNum = rows_club[0].Club_idClub,
            club_name = rows_club[0].Club_Name,
            role_name = rows_club[0].Role,
            Display_name = rows_club[0].Display_name;

            var select_events_query = "SELECT * FROM events WHERE Club_idClub =" + club_idNum;
            connection.query(select_events_query,function(err,rows_event){
                if (err){
                    console.log("error events");
                    return;
                }
                if (rows_event.length) {
                    var l_event = rows_event.length;
                    var ex_event_id = [],
                        ex_event_title = [],
                        ex_event_end_time = [],
                        ex_event_time = [];

                    for (var index = 0; index < l_event; index++) {
                        ex_event_id.push(rows_event[index].idEvents.toString());
                        ex_event_title.push(rows_event[index].Title.toString());
                        ex_event_time.push(rows_event[index].Start_time.toString());
                        ex_event_end_time.push(rows_event[index].End_time.toString());
                    }
                    ex_event_id = ex_event_id.toString();
                    ex_event_title = ex_event_title.toString();
                    ex_event_time = ex_event_time.toString();
                    ex_event_end_time = ex_event_end_time.toString();
                    res.render('profile.ejs',{
                        ex_event_id : ex_event_id,
                        ex_event_title : ex_event_title,
                        ex_event_time : ex_event_time, //get the user information
                        ex_event_end_time : ex_event_end_time,
                        club_idNum : club_idNum,
                        club_name : club_name,
                        Display_name : Display_name,
                        role_name : role_name
                    }); 
                }
                else{
                    res.render('profile.ejs',{
                        ex_event_id : '',
                        ex_event_title : '',
                        ex_event_time : '', //get the user information
                        ex_event_end_time : '',
                        club_idNum : club_idNum,
                        club_name : club_name,
                        Display_name : Display_name,
                        role_name : role_name

                    }); 
                }   
                
            });    
        });
    });

    app.post('/profile',function(req, res){
        if (req.body.edit_event == null){
            var insertQuery = "INSERT INTO events (Title, Start_time, End_time, Club_idClub) VALUES ('" + req.body.what + "','" + req.body.startDate +"','"+req.body.endDate +"','"+req.body.club_idNum + "')";
        }
        else{
            //
            var insertQuery = "UPDATE events SET Title = "+ req.body.what+ ", Start_time = '"+ req.body.startDate + "', End_time = '"+req.body.endDate+"' WHERE idEvents = "+req.body.eventID;
        }
        
        connection.query(insertQuery,function(err,rows){
            if (err){
                console.log(err);
                console.log("event error");
            }else{
                res.writeHead(303, { Location : req.url});
                res.end();
            }
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