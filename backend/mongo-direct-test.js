require('dotenv').config();
const { MongoClient } = require('mongodb');
const path = require('path');

// Hosts discovered from SRV lookup
const hosts = [
  'ac-r4sv3vg-shard-00-00.wf9n722.mongodb.net:27017',
  'ac-r4sv3vg-shard-00-01.wf9n722.mongodb.net:27017',
  'ac-r4sv3vg-shard-00-02.wf9n722.mongodb.net:27017',
];

function parseCreds(uri) {
  // expects mongodb+srv://user:pass@...
  const m = uri && uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@/);
  if (!m) return null;
  return { user: m[1], pass: m[2] };
}

async function test() {
  const orig = process.env.MONGO_URI;
  console.log('Orig MONGO_URI:', orig ? orig.replace(/([^:]+):([^@]+)@/, '<creds>@') : orig);
  const creds = parseCreds(orig);
  if (!creds) return console.error('Could not parse credentials from MONGO_URI');

  const hostlist = hosts.join(',');
  const uri = `mongodb://${creds.user}:${creds.pass}@${hostlist}/campusconnect?ssl=true&authSource=admin&retryWrites=true&w=majority`;
  console.log('Trying non-SRV URI:', uri.replace(/([^:]+):([^@]+)@/, '<creds>@'));

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    const dbs = await client.db().admin().listDatabases();
    console.log('Connected. Databases:', dbs.databases.map(d => d.name).slice(0, 10));
    await client.close();
  } catch (err) {
    console.error('Direct connection error:');
    console.error(err && err.stack ? err.stack : err);
    process.exitCode = 1;
  }
}

test();
