const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI)
  .then(()=> {
    console.log('Connected to DB:', mongoose.connection.db.databaseName);
    return mongoose.connection.db.collection('hostels').find({}).toArray();
  })
  .then(docs => console.log('Hostel count:', docs.length, docs[0] || 'no-docs'))
  .catch(err => console.error('ERROR:', err && err.message))
  .finally(() => process.exit());
