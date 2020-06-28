var express = require("express"),
	app = express(),
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	Post = require("./models/posts"),
	User = require("./models/user"),
	Comment = require("./models/comment"),
	path = require('path'),
	seedDB = require("./seed");

	var commentRoutes = require("./routes/comments"),
		postsRoutes = require("./routes/posts"),
		authRoutes = require("./routes/index");

// APP CONFIG
//seedDB();
mongoose.connect("mongodb+srv://ahmetfbas:bvkbs2AB.@sosyalhayvan-x9d4g.mongodb.net/sosyal_hayvan?retryWrites=true&w=majority",{ 
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	useFindAndModify: false,
	useCreateIndex: true}).then(() => {
	console.log("connected to db");
}).catch(err =>{
	console.log("err", err.message);
});



app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//app.use(express.static("public"));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());
app.use( express.static(path.join(__dirname, 'public')));


app.locals.moment = require('moment');
//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "mulk allahındır",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use(authRoutes);
app.use(postsRoutes);
app.use(commentRoutes);



app.listen(3000,function(){
	console.log("server is listening");
});