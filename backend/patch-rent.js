const mongoose = require('mongoose');
require('dotenv').config();
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const c = mongoose.connection.db.collection('hostels');
    const r = await c.updateMany({ rent: { $exists: false }, price: { $exists: true } }, [ { $set: { rent: '$price' } } ]);
    console.log('Updated:', r.modifiedCount);
  } catch (err) {
    console.error('ERROR:', err && err.message);
  } finally {
    process.exit();
  }
})();
