var express = require("express");
var router = express.Router();
var Post = require("../models/posts");
var Comment = require("../models/comment");
var middleware = require("../middleware")
//COMMENT ROUTES

router.get("/posts/:id/comments/new",middleware.isLoggedIn , function(req,res){
	Post.findById(req.params.id, function(err,commentpost){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {commentpost:commentpost});
		}
	})
	
});

router.post("/posts/:id/comments",middleware.isLoggedIn,function(req,res){
	Post.findById(req.params.id, function(err,commentpost){
		if(err){
			console.log(err);
		}
		else{
			Comment.create(req.body.comment, function(err,comment){
				if(err){
					console.log(err);
				}
				else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.author.avatar = req.user.avatar;
					comment.save();
					commentpost.comments.push(comment);
					commentpost.save();
					res.redirect("/posts/"+ commentpost.id);
					
				}
			});
			
		}
	})
	
});

module.exports  = router;