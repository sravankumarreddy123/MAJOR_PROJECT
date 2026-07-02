require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const ejsMate = require("ejs-mate");

app.engine('ejs', ejsMate);
var methodOverride = require('method-override');
const ExpressError = require("./utils/ExpressError.js");
app.use(methodOverride('_method'))
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));

const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listing = require("./routes/listing.js");
const review = require("./routes/review.js");
const user = require("./routes/user.js");

const port = 3000;
const dbUrl = process.env.ATLASDB_URL;
main()
.then(()=>{
        console.log("connection succeful!");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);


}
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRAT,
    },
    touchAfter: 24*3600,
});
store.on("error",()=>{
    console.log("Error in mongo session store",err);
});

const sessionOption = {
    store,
    secret:process.env.SECRAT,
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly:true,
    }
}

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});



app.use("/listing",listing);
app.use("/listing/:id/review",review);
app.use("/",user);


app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})
app.use((err,req,res,next)=>{
    let {status=500,message="something went wrong"} = err;
    res.status(status).render("error.ejs",{message});

})
app.listen(port,()=>{
    console.log("server is listening to requiests");
})

// inorder in escape from tds task we are using joi tool for schema validation