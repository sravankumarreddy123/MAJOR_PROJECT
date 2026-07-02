const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing.js");
main()
.then(()=>{
        console.log("connection succeful!");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async()=>{
    await Listing.deleteMany();
   initdata.data = initdata.data.map((obj)=>{
      return {...obj,owner:"6a33cba073e9636e5a013938"}
    })
    await Listing.insertMany(initdata.data);
    console.log("data initialised");

}
initDB();

