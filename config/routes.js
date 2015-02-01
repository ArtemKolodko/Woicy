var User = require('../app/models/user');
var Record = require('../app/models/record');
var Auth = require('./middlewares/authorization.js');

module.exports = function(app, passport){
	app.get("/", function(req, res){ 
		if(req.isAuthenticated()){
		  res.render("home", { user : req.user, pageTitle: "Woicy"});
		}else{
			res.render("home", { user : null, pageTitle: "Woicy (not auth)"});
		}
	});

	app.get("/login", function(req, res){ 
		res.render("login");
	});

	app.post("/login" 
		,passport.authenticate('local',{
			successRedirect : "/",
			failureRedirect : "/login"
		})
	);

	app.get("/signup", function (req, res) {
		res.render("signup");
	});

	app.post("/signup", Auth.userExist, function (req, res, next) {
		User.signup(req.body.email, req.body.password, function(err, user){
			if(err) throw err;
			req.login(user, function(err){
				if(err) return next(err);
				return res.redirect("profile");
			});
		});
	});

    // Facebook auth
	app.get("/auth/facebook", passport.authenticate("facebook",{ scope : "email"}));
	app.get("/auth/facebook/callback", 
		passport.authenticate("facebook",{ failureRedirect: '/'}),
		function(req,res){
			res.render("home", {user : req.user}); // после успешного логина заходим на главную страницу
		}
	);

    // Google Auth
	app.get('/auth/google',
	  passport.authenticate(
	  	'google',
		  {
		  	scope: [
		  	'https://www.googleapis.com/auth/userinfo.profile',
		  	'https://www.googleapis.com/auth/userinfo.email'
		  	]
		  })
	  );

	app.get('/auth/google/callback', 
	  passport.authenticate('google', { failureRedirect: '/' }),
	  function(req, res) {
	    // Successful authentication, redirect home.
	    res.redirect('/');
	  });

    // VK Auth
    app.get('/auth/vk',
        passport.authenticate('vkontakte', { scope: ['email'] }), //, { scope: ['email'] }
        function(req, res){

            // The request will be redirected to vk.com for authentication, so
            // this function will not be called.
        });

    app.get('/auth/vk/callback',
        passport.authenticate('vkontakte', { failureRedirect: '/' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/');
        });

	app.get("/profile", Auth.isAuthenticated , function(req, res){
        // get records, associated with user._id
        console.log("id: ", req.user._id);
        Record.getRecordsById(req.user._id, {}, function(records) {
            console.log("records", records);
            res.render("profile", { user : req.user, records: records});
        });

		//res.render("profile", { user : req.user});
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	app.post('/appendRecord', function(req, res) {
		// data stored in req.body

		Record.append(req.user, req.body, function(err, user){

		});

	});
}