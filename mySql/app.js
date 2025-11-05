// import mysql from 'mysql2/promise'

// const db=await mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"@Lalbazar12",
//     database:"kamrans_database"
// })

// create database

// await db.execute(`create database kamrans_database`)

// const databases=await db.execute('show databases')
// console.log(databases);

// await db.execute(`CREATE TABLE sqlkamran(
//   id int auto_increment primary key,
//   name varchar(100) not null,
//   email varchar(100) not null unique
// );`
// )

// await db.execute(`insert into sqlkamran(name,email) values("kamransidiq","kamran@gmial.com")`)  not good practice

//? await db.execute(`insert into sqlkamran(name,email) values(?,?)`,["saniya","saniay@gmail.com"]) good practice 

//! important note 

//? jb bahot zyada array of array insert karne ho tou tb db.execute nhi lagegaa but db.query lagega simple mai 


// update user
// set email="rubiya@gmail.com"
// where name="rubiyasidiq"

//? await db.execute(`update sqlkamran set email="kamransidiq169@gmail.com" where name="kamransidiq"`)

// DELETE FROM user WHERE name="rubiyasidiq";

//? await db.execute(`delete from sqlkamran where name="kamransidiq"`)

// const[row]=await db.execute("select * from sqlkamran")
// console.log(row);
