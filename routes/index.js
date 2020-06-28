var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Post = require("../models/posts");
var middleware = require("../middleware")
// AUTH ROUTES

//show register form
router.get("/register", function (req, res) {
	res.render("register");
});

router.post("/register", function (req, res) {
	var newUser = new User({ username: req.body.username, avatar: req.body.avatar, description: req.body.description });
	
	if (req.body.adminCode === 'mülkallahındır') {

		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function (err, user) {
		if (err) {
			req.flash("error", "Belki de başka bir kullanıcı adı seçmelisin..");
			res.redirect("register")
		}
		passport.authenticate("local")(req, res, function () {
			req.flash("success", "Hoşgeldin!");
			res.redirect("/posts");
			
		});
	});
});

//show login form
router.get("/login", function (req, res) {

	res.render("login");
});
//handling login logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/posts",
		failureRedirect: "/login",
	failureFlash: true
	}), function (req, res) {
		console.log(req);
	});
//logout route
router.get("/logout", function (req, res) {
	req.logout();
	req.flash("success", "Güle Güle Sosyal Hayvan!");
	res.redirect("/posts");
});


//User Profile
router.get("/users/:id", function (req, res) {
	User.findById(req.params.id, function (err, foundUser) {
		if (err) {
			req.flash("error", "Something went wrong");
			res.redirect("/posts")
		}
		Post.find().where('author.id').equals(foundUser._id).exec(function (err, posts) {
			if (err) {
				req.flash("error", "Something went wrong");
				res.redirect("/posts")
			}
			res.render("./users/show", { user: foundUser, posts: posts })
		});
	});
});

module.exports = router;