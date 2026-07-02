const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req,res)=>{
   
    const listing= await Listing.findById(req.params.id);
    const newreview = new Review(req.body.review);
    newreview.author = req.user._id;
    console.log(newreview);
    listing.reviews.push(newreview._id
        
    );
    await newreview.save();

    await  listing.save();
    req.flash("success","Review Posted successfully");
    res.redirect(`/listing/${req.params.id}`);

}

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted successfully");
    res.redirect(`/listing/${id}`);
};