var express			 = require("express");
var router  		 = express.Router({mergeParams: true});
const Campground 	 = require("../models/campground.js");
const Comment   	 = require("../models/comment.js");
var middleware 		 = require("../middleware/")

//COMMENT CREATE FORM
router.get("/new", middleware.isLoggedIn, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err){
			console.log(err);
		}else{
			res.render("comments/new", {campground: campground});	
		}
	})
})
// COMMENT CREATE
router.post("/", middleware.isLoggedIn, (req, res)=>{
	Comment.create(req.body.Comment, (err, comment)=>{
		if(err){
			console.log(err);
		}else{
			Campground.findById(req.params.id).exec((err, campground)=>{
				if(err){
					console.log(err)
				}else{
					comment.author.username = req.user.username;
					comment.author.id = req.user._id;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment Created!");
					res.redirect("/campgrounds/" + req.params.id);
				}
			})
		}
	})
})

//COMMENT EDIT FORM
router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res)=>{	
	Campground.findById(req.params.id, (err, campground)=>{
		if(err || !campground){
			req.flash("error", "Campground not found!");
			res.redirect("back");
		}else{
			Comment.findById(req.params.comment_id, (err, comment)=>{
			if(err||!comment){
				req.flash("error", "Comment not found!");
				res.redirect("back")
			}
			else{
				res.render("comments/edit",{comment: comment, campground_id: req.params.id, comment_id: req.params.comment_id});
			}
		})	
		}
	})
});

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.Comment, function(err, comment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id );
      }
   });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err, comment)=>{
		if(err){
			res.redirect("back")
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})


module.exports = router;
