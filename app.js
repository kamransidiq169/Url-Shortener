
import express from 'express'
import { PORT } from './env.js'
import path from 'path'
const app=express()// simple create instance of express ab saare properties is app mai agaye

// app.get("/",(req,res)=>{
//     res.send("<h1>Hello World</h1>")
// })

// app.get("/contact",(req,res)=>{
//     res.send(`<div class="container">
//         <h1>URL SHORTENER</h1>
//          <form id="shortened-form">
//             <label for="url">Enter URL</label>
//             <input type="text" name="url" id="url" placeholder="Please enter the url" required autocomplete="off" >
//             <label for="shortcode">Enter shortcode</label>
//             <input type="text" name="shortcode" id="shortcode" placeholder="Please enter the shortcode" required autocomplete="off" >
//             <button type="submit">Shorten</button>
//          </form>
//          <h2 id="shortened-urls">Shortened URLs</h2>
//     </div>`)
// })

// const PORT=3000
// app.listen(PORT,()=>{
//     console.log(`port is listening at ${PORT}`);
    
// })

//! express video 1 ends Here



// const app=express()// simple create instance of express ab saare properties is app mai agaye

// app.get("/",(req,res)=>{
//     res.send("<h1>Hello World</h1>")
// })

// app.get("/contact",(req,res)=>{
//     res.send(`<div class="container">
//         <h1>URL SHORTENER</h1>
//          <form id="shortened-form">
//             <label for="url">Enter URL</label>
//             <input type="text" name="url" id="url" placeholder="Please enter the url" required autocomplete="off" >
//             <label for="shortcode">Enter shortcode</label>
//             <input type="text" name="shortcode" id="shortcode" placeholder="Please enter the shortcode" required autocomplete="off" >
//             <button type="submit">Shorten</button>
//          </form>
//          <h2 id="shortened-urls">Shortened URLs</h2>
//     </div>`)
// })

// const PORT=process.env.PORT
// app.listen(PORT,()=>{
//     console.log(`port is listening at ${PORT}`);
    
// })

//! video 2 ends here

//! Video 4 starts here

// app.use(express.static("public"))//? always be on top ye sb static files ko share karta hai but jo bhi files hame share karne hai wo public folder ke andar ho

//app.get("/",(req,res)=>{
    //console.log(import.meta.dirname);// shows ki tum kis folder mai ho
    //console.log(import.meta.url);// shows ki folder mai kis jagah abhi ho
    // const homePath=path.join(import.meta.dirname,"public","index.html")
    // res.sendFile(homePath)// they will send only index.html but in case you want to show css
    
//})


//! video 5 starts now explain route parameters 

// app.get("/profile/:username",(req,res)=>{
//     res.send(`Hi my name is ${req.params.username}`)
// })
// app.get("/profile/:username/article/:slug",(req,res)=>{
//     const formattedSlug=req.params.slug.replace(/-/g," ")
//     res.send(`Hi my name is ${req.params.username} and my article is ${formattedSlug}`)
// })


//!video 6 starts now query parameters

// app.get("/product",(req,res)=>{
//     console.log(req.query);
//     res.send(`hi you searched for ${req.query.search}`)
// })
// app.get("/product",(req,res)=>{
//     console.log(req.query);
//     res.send(`hi you searched for ${req.query.page} and limit is ${req.query.limit} `)
// })

//? url mai jo hum question mark mai jo bhi likhte hai wo hamara phir query parameter hota hai jaise ?search=samsungs23ultra


//! Video number 7 form submission in express

// app.use(express.static("public"))
 
// app.use(express.urlencoded({extended:true})) //? extended true se kya hoga ki wo nested object easily banasakhta hai

// app.post("/contact",(req,res)=>{
//     console.log(req.body); //? is sai tb tak data nhi aayega jb tak tum express.urlencoded likho 
//     res.send("successfully submitted")
// })

//! handling error page 

// app.use((req,res)=>{
//     return res.status(404).sendFile(path.join(import.meta.dirname,"views","404.html"))
// })

// app.listen(PORT,()=>{
//     console.log(`port is listening at ${PORT}`);
    
// })