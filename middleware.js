const Listing = require("./models/listing.js");
const Review = require("./models/review.js");

const Loggedin = (req,res,next)=>{
   
    if(!req.isAuthenticated()){
        req.session.redirUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing!");
       return res.redirect("/login")

    }
    next();
}
const DeleteAuthorize = (req,res,next)=>{
    let{id}=req.params;  
    
    if(!req.isAuthenticated()){
        req.session.redirUrl = `/listing/${id}` ;
        req.flash("error","you must be logged in to create listing!");
       return res.redirect("/login")

    }
    next();
}

const saveUrl = (req,res,next)=>{
    res.locals.redirUrl = req.session.redirUrl;
    next();
}

const isOwner = async(req,res,next)=>{
        let{id}=req.params;      
         const listing =  await Listing.findById(id);
         if(req.user && !listing.owner.equals(req.user._id)){
            req.flash("error","your not owner of this listing");
            return res.redirect(`/listing/${id}`);
    
         }
         next()
}
const isReviewAuthor = async(req,res,next)=>{
        let{id,reviewId}=req.params;      
         const review =  await Review.findById(reviewId);
         console.log(review);
         if(req.user && !review.author.equals(req.user._id)){
            req.flash("error","Sorry your not owner of this Review");
            return res.redirect(`/listing/${id}`);
         }
         next()
}
module.exports = {Loggedin,saveUrl,isOwner,isReviewAuthor,DeleteAuthorize};