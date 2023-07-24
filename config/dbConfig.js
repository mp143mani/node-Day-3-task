const { MongoClient } = require('mongodb');
const dbname ='skct_147';
const dbUrl = `mongodb+srv://mani143tech:mani4213@cluster0.ckxmigv.mongodb.net/${dbname}`;

let dbClient;

async function connectToDatabase() {
  if (!dbClient) {
    dbClient = await MongoClient.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
  }
  return dbClient.db(dbname);
}

module.exports = {
  connectToDatabase,
};
