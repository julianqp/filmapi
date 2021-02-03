const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const URL = process.env.MONGO_URL;
const DB = process.env.MONGO_DB;
const USERDB = process.env.MONGO_USER;
const PASS = process.env.MONGO_PASS;

const mongoDB = `mongodb+srv://${USERDB}:${PASS}@${URL}/${DB}?retryWrites=true&w=majority`;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
module.exports = mongoose;
