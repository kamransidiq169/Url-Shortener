// import { db } from "./config/db.js";
// import { usersTable } from "./drizzle/schema.js";


//const main=async()=>{
// await db.insert(usersTable).values([
//   { name: "saniyasidiq", age: 19, email: "saniyasidiq@gmail.com" },
//   { name: "mohammadsidiq", age: 41, email: "mohammadsidiq@gmail.com" }
// ]);

// const readData=await db.select().from(usersTable);
// console.log(readData);

// const updatedData=await db.update(usersTable).set({name:"kamransidiqbhat"}).where({email:"kamransidiq@gmail.com"})
// console.log(updatedData);

// const deletedData= await db.delete(usersTable).where({email:"kamransidiq@gmail.com"})
// console.log(deletedData);


//! Full Curd Operation Defined

// }

// main().catch((err)=>console.log(err)
// )