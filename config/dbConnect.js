const mongoose  = require("mongoose")


const DBconnect = async() => {
    await mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log('connect'))
    .catch((error)=>{console.log(error)})
}

DBconnect();

module.exports = DBconnect;

