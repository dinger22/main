var mysql        = require("mysql");
var connection  = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "11235813",
    database: "mydb"
});

module.exports = function(app) {
        // =====================================
    // Sign Up profile(fill in profile page)=======
    // =====================================
    // show the signup form
    app.get('/signup_profile', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup_profile.ejs',{
            user : req.user //get the user information 
        });
    });
    app.post('/signup_profile', function(req, res){
        connection.query("UPDATE user SET College = ?, Display_name = ? Where idUser = ?",[req.body.College,req.body.Name,req.user.idUser],function(err){
            if(err){
                console.log("baaaaaaaaaaaaaaaaaaaaaaaaaaad");
                res.status(500).end();
                return;
            }
            console.log("gooooooooooooooooooooood");
            if (!req.body.Club_Name){
                res.render('signup_create_club.ejs');
            }else{
                res.render('profile.ejs');
            }
            
            return;
        });
        
    });

        // =====================================
    // Sign Up create club(fill in club info page)=======
    // =====================================
    // show the signup form
    app.get('/signup_create_club', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup_create_club.ejs');
    });

    app.post('/signup_create_club', function(req, res){

        connection.query("SELECT * FROM club WHERE Description = '"+req.body.Club_Name+"'",function(err,rows){
            console.log(rows);
            console.log("above row object");
            if (err)
                console.log(err);
            if (rows.length) {
                console.log("name taken");
            } else {

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
                                res.render('profile.ejs',{
            user : req.user //get the user information 
        }); 
                    }

                }); 
            }   
        });
        
    });

}