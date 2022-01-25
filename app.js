import express from 'express';
import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';
import config from 'config';

import appController from './controllers/appController.js';
import isAuth from './middleware/is-auth.js';
import connectDB from './config/db.js';

const MongoDBS = MongoDBStore(session);
const mongoURI = config.get('mongoURI');

const app = express();
connectDB();

const store = new MongoDBS({
  uri: mongoURI,
  collection: "mySessions",
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//=================== Routes
// Landing Page
app.get("/", appController.landing_page);

// Login Page
app.get("/login", appController.login_get);
app.post("/login", appController.login_post);

// Register Page
app.get("/register", appController.register_get);
app.post("/register", appController.register_post);

// Dashboard Page
app.get("/dashboard", isAuth, appController.dashboard_get);

app.post("/logout", appController.logout_post);

app.listen(5000, console.log("App Running on http://localhost:5000"));
