import crypto from 'crypto'
import {loadLinks,saveLinks,getlinkbyShortCode, findshortlinkbyId, deleteShortLinkbyId} from "../services/shortener.js"
import z from 'zod'
// import fs from "fs/promises"
// import path from 'path'
export const getShortenerPage= async (req, res) => {
  try {
    //const file = await fs.readFile(path.join('views', 'index.html'));

    // let isLoggedIn=req.headers.cookie;
    // isLoggedIn=Boolean(isLoggedIn?.split("=")[1])
    //  console.log(isLoggedIn);

    //! hum ab cookie parser middleware use karengai
    
    //let isLoggedIn=req.cookies.isLoggedIn  // ye wali line seedia isloggedin ki value dikha ta jo true hai 
     if(!req.user?.id){
      // return res.status(401).send("user not logged in")
      return res.redirect("/login")
     }
    const links = await loadLinks(req.user.id);
     res.render('index',{links, host:req.host,user:req.user})
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error'); 
  }
};

// export const getShortenerPage = async (req, res) => {
//   try {
//     const userId = req.session?.user?.id;
//     if (!userId) return res.status(401).send('User not logged in');

//     const links = await loadLinks(userId);
//     res.render('index', { links, host: req.host, user: req.session.user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// };

export const postControllerData= async (req, res) => {
  try {
    const links = await loadLinks();
    const { url, shortcode } = req.body;

    const finalShortCode = shortcode || crypto.randomBytes(4).toString('hex');

    if (links[finalShortCode]) {
      return res.status(400).send('Shortcode already exists. Please choose another.');
    }

    // links[finalShortCode] = url;
    // await saveLinks({url,shortcode}); for mongodb
      await saveLinks({url,shortcode,userId:req.user.id})
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error saving link');
  }
};

// export const redirectPage=async(req,res)=>{
//    try {
    // const {shortCode}=req.params;
  //   const links=await loadLinks()
  //  if(!links[shortcode]){
  //   return res.status(400).send("404 error occured")
  //  }
//   const link=await getlinkbyShortCode(shortCode)
//   if (!link) {
//   return res.status(404).send("404: Short link not found")
//   // or serve a static 404 page
// }
//    return res.redirect(link.url)
//    } catch (error) {
//     console.error(error)
//     return res.status(500).send("Internal server error")
//    }

// }

// using gpt
export const redirectPage = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Ignore requests like favicon.ico or invalid shortcodes
    if (!shortCode || shortCode === 'favicon.ico') {
      return res.status(204).end(); // No Content
    }

    const link = await getlinkbyShortCode(shortCode);

    if (!link || !link.url) {
      return res.status(404).render("404", {
        message: "Short link not found",
        shortcode: shortCode
      });
    }

    return res.redirect(link.url);
  } catch (error) {
    console.error("Redirect error:", error);
    return res.status(500).render("error", {
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getShortnerEditPage=async(req,res)=>{
    const {data:id,error}= z.coerce.number().int().safeParse(req.params.id)
    try {
       const [shortLink]= await findshortlinkbyId(id)
 
       if(!shortLink){
        return res.redirect("/404")
       }

   res.render("edit-shortener",{
    id:shortLink.id,
    url:shortLink.url,
    shortcode:shortLink.shortcode,
    //error:req.flash("errors")
   })


    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error")
    }
}

export const deleteShortLink=async(req,res)=>{
   const {data:id,error}= z.coerce.number().int().safeParse(req.params.id)
    
    if(error){
      res.redirect("/404")
    }

    await deleteShortLinkbyId(id)

    res.redirect("/")
}