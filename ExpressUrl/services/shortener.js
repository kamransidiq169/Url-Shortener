// import {PrismaClient} from "@prisma/client"

// const prisma=new PrismaClient()
// export const loadLinks=async()=>{
//   const allShortLinks=await prisma.user.findMany()
//   return allShortLinks
// }

//  export const saveLinks = async ({url,shortcode}) => {
//    const insertedData=await prisma.user.create({
//     data:{url,shortcode}
//    })
//    return insertedData
//  };

//   export const getlinkbyShortCode=async(shortCode)=>{
// const rl=await prisma.user.findUnique({
//     where:{shortcode:shortCode}
// })
// return rl
//  }
 
import { db } from "../config/db.js";
import { shortLinks } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";

// Load all short links
export const loadLinks = async (userId) => {
  const allShortLinks = await db.select().from(shortLinks).where(eq(shortLinks.userId,userId));
  return allShortLinks;
};

// Save a new short link
export const saveLinks = async ({ url, shortcode,userId }) => {
  const result = await db.insert(shortLinks).values({ url, shortcode, userId });
  return result;
};

// Get link by shortcode
export const getlinkbyShortCode = async (shortcode) => {
  const result = await db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.shortcode, shortcode));
  return result[0]; // return first match
};

export const findshortlinkbyId=async(id)=>{
  const allShortLinks = await db.select().from(shortLinks).where(eq(shortLinks.id,id));
  return allShortLinks;
} 

export const deleteShortLinkbyId=async(id)=>{
  return await db.delete(shortLinks).where(eq(shortLinks.id,id))
}