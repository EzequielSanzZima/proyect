import session from "express-session";
import MongoStore from "connect-mongo";
import bCrypt from "bcrypt";
import dotenv from 'dotenv'
dotenv.config()

function createOnMongoStore() {
  const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
  return session({
    store: MongoStore.create({
      mongoUrl:
        process.env.MONGO_REMOTE_CONNECT,
      mongoOptions: advancedOptions,
      ttl: 120,
      collectionName: "sessions",
    }),
    secret: "EzequielSz",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  });
}

function createHash(password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

function isValidPassword(user, password) {
  return bCrypt.compareSync(password, user.password);
}

export default { createOnMongoStore, createHash, isValidPassword };

// module.exports = { createOnMongoStore, createHash, isValidPassword }

export const asPOJO = (obj) => JSON.parse(JSON.stringify(obj));

export const renameField = (record, from, to) => {
  record[to] = record[from];
  delete record[from];
  return record;
};
export const removeField = (record, field) => {
  const value = record[field];
  delete record[field];
  return value;
};
