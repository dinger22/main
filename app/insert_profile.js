var mysql        = require("mysql");
var connection  = mysql.createConnection({
  host: "groop123.ctrhjjzjrs0h.us-west-2.rds.amazonaws.com",
  user: "groopdb",
  password: "11235813",
  database: "mydb",
  port:"3306"
});

module.exports = function(app) {
        // =====================================
    // Sign Up profile(fill in profile page)=======
    // =====================================
    // show the signup form
    app.get('/signup_profile', function(req, res) {
        // render the page and pass in any flash data if it exists
        connection.query("SELECT Club_Name FROM club",function(err,rows){
            if(err){
                return;
            }
            else{
                var l_club = rows.length;
                var ex_club_name = [];
                for (var index = 0; index < l_club; index++) {
                    ex_club_name.push(rows[index].Club_Name.toString());
                }
                ex_club_name = ex_club_name.toString();
                res.render('signup_profile.ejs',{
                    user : req.user, //get the user information 
                    ex_club_name : ex_club_name
                });
            }
        });

    });
    app.post('/signup_profile', function(req, res){
        connection.query("UPDATE user SET College = ?, Display_name = ? Where idUser = ?",[req.body.College,req.body.Name,req.user.idUser],function(err){
            connection.query("INSERT INTO organizer_team (User_idUser, Role) values ('" + req.user.idUser+ "','"+ req.body.Club_Role +"')", function(err){
                if(err){
                    console.log(err);
                    res.status(500).end();
                    return;
                }
                if (req.body.Club_Name == "noclub"){
                    res.writeHead(303, { Location : '/signup_create_club', user:req.user});
                    res.end();
                }else{
                    connection.query("SELECT idClub FROM club where Club_Name = ?",[req.body.Club_Name],function(err,idclub){
                        connection.query("INSERT INTO membership (Club_idClub, User_idUser) values ('"+idclub[0].idClub+"','"+req.user.idUser+"')", function(err){ 
                            res.writeHead(303, { Location : '/profile', user:req.user});
                            res.end();
                        });     
                    });
                }
                return; 
                });
        });
        
    });

        // =====================================
    // Sign Up create club(fill in club info page)=======
    // =====================================
    // show the signup form
    app.get('/signup_create_club', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup_create_club.ejs', { 
            message : ''
        }); 
    });

    app.post('/signup_create_club', function(req, res){

        connection.query("SELECT * FROM club WHERE Club_Name = '"+req.body.Club_Name+"'",function(err,rows){
            console.log(rows);
            console.log("above row object");
            if (err)
                console.log(err);
            if (rows.length) {
                res.render('signup_create_club.ejs', { 
                    message: "This club name is already taken"
                }); 
                // console.log("name taken");
                // res.writeHead(303, { Location : '/signup_create_club', user:req.user});
                // res.end();
            } 
            else {
                // if there is no user with that email
                // create the user
                var newClub = new Object();
                
                newClub.Club_Name    = req.body.Club_Name;
                newClub.Abbreviation    = req.body.Abbreviation;
                newClub.School    = req.body.School;
                newClub.Description    = req.body.Description;
                newClub.Website    = req.body.Website;
                newClub.Phone    = req.body.Phone;
                newClub.Email    = req.body.Email;
                newClub.President    = req.body.President;
                 // use the generateHash function in our user model
                var insertQuery = "INSERT INTO club ( Club_Name, School, Description, Website, President) values ('" + req.body.Club_Name  +"','"+ req.body.School +"','"+ req.body.escription +"','"+ req.body.Website +"','"+ req.body.President+"')";
                connection.query(insertQuery,function(err,rows){
                    //newUserMysql.idClub = rows.insertId;
                    if (err){
                        console.log("club error");
                    }else{
                        connection.query("SELECT idClub FROM club where Club_Name = ?",[req.body.Club_Name],function(err,idclub){
                            connection.query("INSERT INTO membership (Club_idClub, User_idUser) values ('"+idclub[0].idClub+"','"+req.user.idUser+"')", function(err){
                                res.writeHead(303, { Location : '/profile', user:req.user});
                                res.end();
                            });
                        });
                    }
                }); 
            }   
        });
        
    });

}