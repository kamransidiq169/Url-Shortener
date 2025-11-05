// import path from 'path'
// import fs from 'fs/promises'
// const DATA_FILE = path.join('data', 'links.json');
// export const loadLinks = async () => {
//   try {
//     const data = await fs.readFile(DATA_FILE, 'utf-8');
//     return JSON.parse(data);
//   } catch (error) {
//     if (error.code === 'ENOENT') {
//       await fs.writeFile(DATA_FILE, JSON.stringify({}), 'utf-8');
//       return {};
//     }
//     throw error;
//   }
// };

// // Save updated links
// export const saveLinks = async (links) => {
//   await fs.writeFile(DATA_FILE, JSON.stringify(links), 'utf-8');
// };



//import { dbClient } from "../config/db-client.js";
// import { env } from "../config/env.js";

// const db=dbClient.db(env.MONGODB_DATABASE_NAME)
// const shortener=db.collection("shortenerData")

// export const loadLinks=async()=>{
     //! return shortener.find().toArray() for mongodb
//   const [rows]= await dbClient.execute(`select * from mysqlShortener`)
//   return rows
// }

//?  export const saveLinks = async (link) => {   for mongodb
//    return shortener.insertOne(link)
//  };


//  export const saveLinks = async ({url,shortcode}) => {
//    const [result] = await dbClient.execute(`insert into mysqlShortener(url,shortcode) values(?,?)`,[url,shortcode])
//    return result
//  };

//  export const getlinkbyShortCode=async(shortCode)=>{
// // return shortener.findOne({shortcode:shortCode})
// const [rows]= await dbClient.execute(`select * from mysqlShortener where shortcode = ?`,[shortCode])
// if(rows.length>0){
//   return rows[0]
// }else{
//   return null
// }
//  }
 