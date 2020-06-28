   
var Post = require("../models/posts");
var middlewareObj = {};

    middlewareObj.checkPostOwnership = function (req, res, next) {
        if (req.isAuthenticated()) {
            Post.findById(req.params.id, function (err, editedPost) {

                if (err) {
                    res.redirect("back");
                }
                else {
                    if (editedPost.author.id.equals(req.user._id) || req.user.isAdmin) {
                        next();
                    }
                    else {
                        res.redirect("back");
                    }
                }
            })
        } else {
            res.redirect("back");
        }
    };

    middlewareObj.isLoggedIn = function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
		req.flash("error", "Önce giriş yapmalısın!");
        res.redirect("/login");
    };

    module.exports = middlewareObj;