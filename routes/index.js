var express 		 = require("express");
var router 		 	 = express.Router(); 
var passport	 	 = require("passport");
var User		     = require("../models/user");

router.get("/", function(req, res){
	res.render("home");
})

// Register
router.get("/register", (req, res)=>{
	res.render("register");
})

router.post("/register", (req, res)=>{
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			req.flash("error", err.message + "!");
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Registered succesfully!");
			res.redirect("/campgrounds");
		})
	})
})

//Login
router.get("/login", (req, res)=>{
	res.render("login");
})

router.post("/login", passport.authenticate("local", {failureRedirect: "/login"}), 
		 (req, res)=>{
	req.flash("success", "Welcome " + req.body.username + "!");
	res.redirect("/campgrounds");
})
//Logout
router.get("/logout", (req,res)=>{
	req.logout();
	req.flash("succes", "Logged Out!");
	res.redirect("/");
})

module.exports = router;
