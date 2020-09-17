const Campground 	 = require("../models/campground.js");
const Comment   	 = require("../models/comment.js");

const middlewareObj= {};

middlewareObj.checkCommentOwnership = function (req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, (err, comment)=>{
			if(err || !comment){
				req.flash("error", "Comment not found!");
				res.redirect("back");
			}
			else{
				if(comment.author.id.equals(req.user._id)){
					next();
				}
				else{
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("error", "You need to be logged in!");
		res.redirect("back");
	}
}
middlewareObj.checkCampgroundOwnership = function (req,res,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, (err, campground)=>{
			if(err || !campground){
				req.flash("error", "Campground not found!");
				res.redirect("back")
			}
			else{
				if(campground.author.id.equals(req.user._id)){
					next();
				}
				else{
					res.redirect("back");
				}
			}
		})
	}
	else{
		req.flash("error", "You need to be logged in!");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function (req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		req.flash("error", "You are not logged in!")
		res.redirect("/login")
	}
}

module.exports = middlewareObj;