
import { Router } from 'express';
import { getShortenerPage,postControllerData,redirectPage,getShortnerEditPage,deleteShortLink } from '../controller/postShortener.js';
const router=Router()

//? const student = [{  !for ejs only
//   name: "Kamran Sidiq",
//   age: 21,
//   course: "BCA",
//   semester: 5,
//   college: "Iqbal Institute of Technology and Management",
// },
// {
//   name: "saniya Sidiq",
//   age: 19,
//   course: "Medical",
//   semester: 5,
//   college: "Iqbal Institute of Technology and Management",
// },
// {
//   name: "Rubiya Sidiq",
//   age: 21,
//   course: "auto",
//   semester: 5,
//   college: "Iqbal Institute of Technology and Management",
// },
// ]
// router.get("/report",(req,res)=>{
//   res.render("report",{student})
// })

// Home page route



router.get("/",getShortenerPage)

router.post("/",postControllerData)

router.get("/:shortCode",redirectPage)

router.route("/edit/:id").get(getShortnerEditPage)

router.route("/delete/:id").post(deleteShortLink)
export default router