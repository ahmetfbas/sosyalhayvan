var express = require("express");
var router = express.Router({ mergeParams: true });
var Post = require("../models/posts");
var middleware = require("../middleware");
var multer = require('multer');
var storage = multer.diskStorage({
	filename: function (req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});
var imageFilter = function (req, file, cb) {
	// accept image files only
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return cb(new Error('Only image files are allowed!'), false);
	}
	cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter })

var cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'sosyal-hayvan',
	api_key: 235458262641236,
	api_secret: 'W7ryurZCkiswGB-kcDc4rko2oO8'
});
// RESTFUL ROUTES
router.get("/", function (req, res) {
	res.redirect("posts");

});

router.get("/posts", function (req, res) {
	if (req.query.search) {
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Post.find( { $or: [ { title: regex }, { content: regex }, { author: {username :regex} } ] } , function (err, allposts) {
			if (err) {
				console.log(err);
			}
			else {
				if(allposts.length <1){
					req.flash('error', "Uygun bir sonuç bulamadık!");
					res.redirect("/posts");
				}
				else{
					res.render("posts", { allposts: allposts, currentUser: req.user })

				}
			}
		});
		
	}
	else {
		Post.find({}, function (err, allposts) {
			if (err) {
				console.log(err);
			}
			else {
				
				res.render("posts", { allposts: allposts, currentUser: req.user })
			}
		});
		
	}


});

//NEW ROUTE
router.get("/posts/new", middleware.isLoggedIn, function (req, res) {
	res.render("createpost");
})

//CREATE ROUTE
router.post("/posts", middleware.isLoggedIn, upload.single('image'), function (req, res) {
	//req.body.post.content = req.sanitize(req.body.post.content);
	cloudinary.uploader.upload(req.file.path, function (result) {
		var image = result.secure_url;
		var title = req.body.post.title;
		var subtitle = req.body.post.subtitle;
		var content = req.body.post.content;
		var author = {
			id: req.user._id,
			username: req.user.username,
			avatar: req.user.avatar,
			description: req.user.description
		}
		var newPost = { title: title, subtitle: subtitle, content: content, author: author, image: image }

		Post.create(newPost, function (err, newlyCreated) {

			if (err) {
				req.flash('error', "Bir şeyler ters gitti!");
				return res.redirect('back');
			}
			else {
				req.flash('success', "Mutluluk sadece paylaşılınca gerçektir!");
				res.redirect('/posts/' + newlyCreated.id);
			}
		})
	});
});


//SHOW ROUTE
router.get("/posts/:id", function (req, res) {
	Post.findById(req.params.id).populate("comments").exec(function (err, foundPost) {
		if (err) {
			console.log(err);
		}
		else {

			res.render("showpost", { foundPost: foundPost });
		}
	});

});

//EDIT ROUTE
router.get("/posts/:id/edit", middleware.checkPostOwnership, function (req, res) {
	Post.findById(req.params.id, function (err, editedPost) {
		if(err){
			req.flash('error', "Bir şeyler ters gitti!");
			return res.redirect('back');
		}
		else{
			res.render("edit", { editedPost: editedPost });
		}
		
	});
})

//UPDATE ROUTE
router.put("/posts/:id", middleware.checkPostOwnership, function (req, res) {
	req.body.content = req.sanitize(req.body.content);
	Post.findByIdAndUpdate(req.params.id, req.body, function (err, editedPost) {
		if (err) {
			console.log(err);
		}
		else {
			req.flash('success', "Paylaşımın güncellendi!");
			res.redirect("/posts/" + req.params.id);
		}
	});
});

//DELETE ROUTE
router.delete("/posts/:id", middleware.checkPostOwnership, function (req, res) {
	Post.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			console.log(err);
		}
		else {
			req.flash('success', "Bye bye love, bye bye happiness, hello emptiness");
			res.redirect("/posts");
		}

	})
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;