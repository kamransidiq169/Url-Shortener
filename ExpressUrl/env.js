// const PORT =isNaN(process.env.PORT) SIMPLE WAY OF VALIDATING

//! USING ZOD VALIDATION FOR VALIDATION VIDEO NO 3

 import {z} from 'zod'

// try {
//     const ageSchema=z.number().min(18).max(100).int()
//     const userAge=19
//     const {data,error,success}=ageSchema.safeParse(userAge) 
//     console.log(success);
    
// } catch (error) {
//     console.log(error);
    
// }

// const portSchema=z.coerce.number().min(1).max(58554).default(3000)
// export const PORT=portSchema.parse(process.env.PORT)