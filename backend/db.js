const mongoose = require('mongoose');  //to use mongoose
const mongoURI ="mongodb://localhost/noteskeep?readPreference=primary&directConnection=true&ssl=false"
const connectToMongo =()=>{
    mongoose.connect(mongoURI, ()=>{
        console.log("Connected");
    })
}
module.exports = connectToMongo;