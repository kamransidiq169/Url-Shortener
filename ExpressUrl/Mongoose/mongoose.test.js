import mongoose from 'mongoose'

// step1 connect with mongoose

try {
    await mongoose.connect("mongodb://127.0.0.1/mongoose_database")
    mongoose.set({'debug':true})
} catch (error) {
    console.error(error)
    process.exit()
}

// step2 define schema

const userSchema=mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true , unique:true},
    age:{type:Number,required:true, min:5},
    createdAt:{type:Date,default:Date.now()}
})

// step3 create model or we can say create collection

const Users=mongoose.model("user",userSchema)
await Users.create({name:"kamran",email:"kamransidiq@gmail.com",age:7})
await mongoose.connection.close()
