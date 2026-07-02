const User = require("../models/user.js");


module.exports.renderSignUpForm = (req,res)=>{
    res.render("./user/signup.ejs");
};



module.exports.signup =  async(req,res)=>{
    try{
        let {username,email,password} =  req.body;
    let newUser = await new User({
        username:username,
        email:email
    });
    let registeredUser = await User.register(newUser,password);

    req.login(registeredUser, (err) => {
    if (err) {
        return next(err);
    }

    req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listing");
});

    }catch(e){
        req.flash("error", e.message );
        res.redirect("/signup");
    }
    

}

module.exports.login = (req,res)=>{
    req.flash("success","welcome to wanderLust! your logged in !");
    const redirUrl = res.locals.redirUrl || "/listing";

    res.redirect(redirUrl);
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("./user/login.ejs");
};

module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        else{
            req.flash("success","Logged out succefully");
            res.redirect("/listing");
        }

    });
};