
import express from 'express';
import {router} from './routes/shortener.routes.js';
import routeAuth from './routes/auth.routes.js';
import cookieParser from 'cookie-parser'
import { verifyAuthentication } from './middleware/verifyAuthentication.js';
import session from 'express-session'
import flash from 'connect-flash'
import requestIp from 'request-ip'
import path from 'path'
import { fileURLToPath } from 'url';
const App = express();

App.use(express.json()); // Required to parse JSON body
App.use(express.static('public'));
App.use(express.urlencoded({ extended: true }));
App.set("view engine","ejs")

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

App.set('views', path.join(__dirname, 'views'));

App.use(cookieParser())
App.use(session({ secret: "mysecret", resave: true, saveUninitialized: false }))
App.use(flash())
App.use(requestIp.mw())
App.use(verifyAuthentication)
App.use((req,res,next)=>{
  res.locals.user=req.user
  return next()
})
App.use(routeAuth);
App.use( router);
let PORT=process.env.PORT || 3000
App.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});