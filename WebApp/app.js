const express 	 		= require('express'),				
	  app     	 	= express(),						
	  bodyParser 		= require('body-parser'),		// import middleware to parse req.body 
	  mongoose   		= require('mongoose'),			// import module for the database
	  passport 		= require("passport"),			// import module for the user authenticatiton
	  LocalStrategy 	= require("passport-local"),		// import module with functions to authenticate user 
	  methodOverride	= require('method-override'),	    	// import module that overrides HTML Get and Post
	  Campground 		= require("./models/campground"),   	// campground model 
	  Comment 	 	= require("./models/comment"),		//    comment model
	  User 			= require("./models/user"),		//       user model
	  seedDB 	 	= require("./seeds");			// seeding function to populate database
		
var commentRoutes    	= require("./routes/comments"),			//  import routes from comments folder
    campgroundRoutes 	= require("./routes/campgrounds"),  		//  import routes from campgrounds folder
    authRoutes       	= require("./routes/authentication");		// import routes from authentication folder

/* Database and regular file configuration */
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);						// avoid deprecated error
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});	// connect to the database
app.use(bodyParser.urlencoded({extended: true}));					// middleware handling url data from form submission
app.use(methodOverride("_method"));
app.set("view engine", "ejs");								// embeded javascript files 
app.use(express.static(__dirname + "/public"));						// serve static files (html, css, js) 
app.listen(3000, () => console.log("Successfully connected to the yelp camp website."));
/* Database, middleware and express routing configuration */

/* Passport Configuration */
app.use(require("express-session")({				  
	secret: "Dynamic Website",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 			// Configured User.authenticate from passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){						// Pass the user object to the var app 
	res.locals.currentUser = req.user;				// user object contains info such as logged in or logged out  
	next();											  
});													  
/* Passport Configuration */

/* Refactored routing methods code to another the folder "routes" */
app.use("/", authRoutes);						// first argument "/" refactors the route name to default 
app.use("/campground", campgroundRoutes);
app.use("/campground/:id/comments", commentRoutes);
app.get("*", function(req,res){
	res.render("miscellaneous")
});
/* Refactored routing methods code to another the folder "routes" */
