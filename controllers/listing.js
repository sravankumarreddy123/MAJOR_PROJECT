const Listing = require("../models/listing.js");

module.exports.index =  async(req,res)=>{
    const allListings = await Listing.find();
   
    res.render("listings/listing.ejs",{allListings});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListings = async(req,res)=>{
    let {id} = req.params;

    let listing = await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author"
    }}).populate("owner");
    if(!listing){
        req.flash("error","Listing your requiested not Exit");
       return res.redirect("/listing");
    }
  
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing = async(req,res)=>{
       let listing = req.body.listing;

    let listing1 = new Listing(listing);
    listing1.owner = req.user._id;
      if (req.file) {
    listing1.image = {
    url: req.file.path,
    filename: req.file.filename
  };
}
   

    await listing1.save();
     
    req.flash("success","New Listing is Added");
    res.redirect("/listing");

    

}

module.exports.renderEditForm = async(req,res)=>{
    let{id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing your requiested not Exit");
        return res.redirect("/listing");
    }
    let originalImage = listing.image.url;
    originalImage=originalImage.replace("/upload","/upload/h_250,w_250/e_blur:300");

    res.render("listings/edit.ejs",{listing,originalImage});
}

module.exports.updateListing = async(req,res)=>{
    let updateList = req.body.listing;
    
     let{id}=req.params;
     
    
    const listing1 = await Listing.findByIdAndUpdate(id,updateList);
      if (typeof req.file !== "undefined") {
    listing1.image = {
        url: req.file.path,
        filename: req.file.filename
    };
    }
   

    await listing1.save();
    
     req.flash("success","List Edited successfully");

    res.redirect(`/listing/${id}`);


}

module.exports.destroyListing =async(req,res)=>{
     let{id}=req.params;
     const listing = await Listing.findByIdAndDelete(id);
     
   req.flash("success","Listing Deleted successfully");
     res.redirect("/listing");

}