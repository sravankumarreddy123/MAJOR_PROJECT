const express = require("express");
const routes = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {Loggedin,isOwner} = require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(404,error);
    }
    next();
}

routes.get("/",wrapAsync(ListingController.index));


routes.get("/new",Loggedin,ListingController.renderNewForm);


routes.post("/",Loggedin,upload.single("listing[image]"),validateListing,wrapAsync(ListingController.createListing));


routes.get("/:id",wrapAsync(ListingController.showListings));

routes.get("/:id/edit",Loggedin,isOwner,wrapAsync(ListingController.renderEditForm));

routes.put("/:id",Loggedin,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(ListingController.updateListing));


routes.delete("/:id",Loggedin,isOwner,wrapAsync(ListingController.destroyListing));


module.exports = routes;