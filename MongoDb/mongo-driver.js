import {MongoClient} from 'mongodb'

const client=new MongoClient('mongodb://127.0.0.1')
await client.connect()

const db=client.db("KamranDataBase")
const usercollection=db.collection('kamrandata')

//! Insert Data 
// usercollection.insertOne({name:'vinod html',age:30})

// usercollection.insertMany([
//     {name:'Kamran sidiq',age:20},
//     {name:'saniya sidiq',age:19},
//     {name:'Rubiya sidiq',age:40},
// ])

//! Read Data
//const readData= await usercollection.find().toArray()
// const readData=await usercollection.findOne({name:"Kamran sidiq"})
// console.log(readData);

//! Update Data

//usercollection.updateOne({name:"Kamran sidiq"},{$set:{name:"Mohammad Sidiq"}})
//usercollection.updateMany({name:"Kamran sidiq"},{$set:{name:"Mohammad Sidiq"}})

//!Delete Data

//usercollection.deleteMany({name:"Mohammad Sidiq"})
// usercollection.deleteOne({name:"Rubiya sidiq"})
//  usercollection.deleteOne({name:"saniya sidiq"})

//? complete curd operation of Mongo db