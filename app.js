const express=require('express')
require('dotenv').config()
const logger=require('morgan')
const path = require('path')
const cookieParser=require('cookie-parser')
const chalk=require('chalk');
const port=process.env.PORT;
const app=express();
const expressLayouts=require('express-ejs-layouts')
const db=require('./config/mongoose')
const rfs=require('rotating-file-stream')
const fs=require('fs');

// Used for session cookies
const session=require('express-session')
const passport=require('passport')
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy')
const passportGoogle=require('./config/passport-google-oauth2-strategy')
const MongoStore = require('connect-mongo');
const sassMiddleware=require('node-sass-middleware')
const flash=require('connect-flash');
const customMware=require('./config/middleware');

const logDirectory=path.join(__dirname,'./production_log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Create a rotating write stream
const requestLogStream = rfs.createStream('request.log', {
    interval: '1d', // Rotate daily
    maxFiles: 30, // Maximum number of rotated files to keep in storage
    path:logDirectory
  });
  
  // Log API requests in the Apache combined format to one log file per day
  app.use(logger('combined',
  {
    stream: requestLogStream,
  })
)
// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log(chalk.inverse.cyanBright('chat server is listening on port 5000.'));

if(process.env.mode=='development'){
    app.use(sassMiddleware({
        src:'./assets/scss',
        dest: './assets/css',
        debug:true,
        outputStyle:'expanded',
        prefix:'/css'
    }))
}

app.use(express.urlencoded()) // encode the req 
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'assets')));
//make uploads path available to the browser
app.use('/uploads',express.static(__dirname + '/uploads'))

// app.use(express.static('./assets'));
app.use(expressLayouts)
//extract style and scripts form the sub pages into the layout
app.set('layout extractStyles',true)
app.set('layout extractScripts',true)


// set up view engine
app.set('view engine','ejs')
app.set('views','./views')

//mongo store is used to store the session cookie in db
app.use(session({
    name:'Zable',
    //ToDo change the secret before the deployament
    secret:'blahh_blahh_bllaahh',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    },
    store: MongoStore.create({
        mongoUrl: `${process.env.db_URI}`,
        autoRemove: 'disabled',
        }),
        function(err){
            console.log(err || 'connect-mongodb setup ok');
        }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser)

app.use(flash());
app.use(customMware.setFlash)
// express router
app.use('/',require('./routes/index')) // route always below the passport

app.listen(port,(err)=>{
    if(err){
        console.log(chalk.inverse.red("Error to Listed the Express Servier"));
        return;
    }
    console.log(chalk.inverse(`Server is connected ${port}.`))
})