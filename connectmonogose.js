const mongoose = require('mongoose');
// Connect to MongoDB
const mongooseClient=()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/causmicwebsites', { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log('Connected to MongoDB'))
      .catch((error) => console.log(error));

}
module.exports=mongooseClient