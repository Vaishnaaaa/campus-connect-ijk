const mongoose = require('mongoose');
require('dotenv').config();
(async function(){
  try{
    await mongoose.connect(process.env.MONGO_URI);
    const docs = await mongoose.connection.db.collection('hostels').find({}).toArray();
    const missing = docs.filter(d => d.rent === undefined || d.rent === null);
    console.log('Missing rent:', missing.map(d => d.name));
  }catch(err){
    console.error('ERROR:', err && err.message);
  }finally{
    process.exit();
  }
})();
