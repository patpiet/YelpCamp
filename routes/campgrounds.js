var express 		 = require("express");
var router  		 = express.Router();
const Campground 	 = require("../models/campground.js");
var middleware 		 = require("../middleware/")


router.get("/", function(req, res){
	Campground.find({}, function(err, campgrounds){
		if(err){
			console.log(err);
		}else{
	res.render("campgrounds/campgrounds", {campgrounds: campgrounds});
		}
	})
})
//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
	var author = {
		username: req.user.username,
		id: req.user._id
	}
	Campground.create(req.body.campground, (err, newcamp)=>{
		if(err){
			console.log(err);
		}
		else{
			newcamp.author = author;
			newcamp.save();
			res.redirect("/campgrounds");
		}
	})
});
//CREATE FORM
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
})
//SHOW PAGE 
router.get("/:id", (req,res)=>{
	Campground.findById(req.params.id).populate("comments").exec((err, campground)=>{
		if(err || !campground){
			req.flash("error", "Campground not found!");
			res.redirect("back");
		}else{
			res.render("campgrounds/show", {campground: campground});
		}
	})
});

// EDIT FORM
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findById(req.params.id, (err, campground)=>{
		if(err || !campground){
			req.flash("error", "Campground not found!");
			res.redirect("/campgrounds")
		}else{
			res.render("campgrounds/edit", {campground: campground});
		}
	})
})
//UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground)=>{
		if(err){
			res.redirect("/campgrounds")
		}
		else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})
//DESTROY THE CAMPGROUND
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res)=>{
	Campground.findByIdAndDelete(req.params.id, (err, campground)=>{
		if(err){
			res.redirect("/campgrounds");
		}else{
			req.flash("success", "Deleted successfully")
			res.redirect("/campgrounds");
		}
	})
})

module.exports = router;
