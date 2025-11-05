// import { PrismaClient } from "@prisma/client"
// import { id } from "zod/locales";

// const prisma = new PrismaClient()

// const main=async()=>{
// const insertData=await prisma.user.create({
//     data:{
//         name:"sansidiq",
//         email:"samsidiq169@gmail.com"
//     }
// })

// const multipleData=await prisma.user.createMany({
//     data:[{
//         name:"Rubiyasidiq",
//         email:"Rubiyasidiq169@gmail.com"
//     },
//     {
//         name:"basitnabimir",
//         email:"basit@gmail.com"
//     }
// ]
// })
// console.log(multipleData);

// const readData=await prisma.user.findMany()
// console.log(readData);

// const readData=await prisma.user.findUnique({
//     where:{id:1}
// })
// console.log(readData);


// const updatedData=await prisma.user.update({
//     where:{id:1},
//     data:{name:"kamran"}
// })
// console.log(updatedData);

// const deletedData=await prisma.user.delete({
//     where:{id:1},
// })
// console.log(deletedData);
// const deletedUser = await prisma.user.deleteMany({
//   where: {
//     id: {
//       in: [3, 4, 5]
//     }
//   }
// });

// console.log(deletedUser);

//}

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })