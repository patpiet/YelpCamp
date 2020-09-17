var express     	 = require("express");
var app         	 = express();
var bodyParser  	 = require('body-parser');
const mongoose   	 = require('mongoose');
const passport	 	 = require("passport");
const LocalStrategy  = require("passport-local");
const Campground 	 = require("./models/campground.js");
const Comment   	 = require("./models/comment.js");
const seedDb     	 = require("./seed.js");
const User			 = require("./models/user");
const methodOverride = require('method-override');
const flash  		 = require('connect-flash');


var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments"),
	indexRoutes      = require("./routes/index")

seedDb();

mongoose.connect('mongodb://localhost/yelp_camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs");
app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: 'Maniu to stara kurwa ez',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next)=>{
	res.locals.currentUser =req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");	
	next();
})

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);




app.listen(3000, function(){
	console.log("Server have started!");
})