import z from 'zod'


export const userLoginSchema=z.object({
    email: z.string().trim().email().max(100,{message:"Email must be no more than 100 characters"}),
    password: z.string().trim().min(3,{message:"password must be atlest 3 characters long"}).max(100,{message:"password cannot be more than 100 characters"})
})

export const userRegistrationSchema=userLoginSchema.extend({
    name: z.string().trim().min(3,{message:"Name must be atlest 3 characters long."}).max(100,{message:"Name must be no more than 100 characters"}),
    // email: z.string().trim().email().max(100,{message:"Email must be no more than 100 characters"}),
    // password: z.string().trim().min(3,{message:"password must be atlest 3 characters long"}).max(100,{message:"password cannot be more than 100 characters"})
})


export const emailVerificationSchema=z.object({
    token:z.string().trim().length(8),
    email:z.string().trim().email()
})

const nameSchema = z.string().trim().min(3,{message:"Name must be at least 3 characters long"}).max(100,{message:"Name must be no more thann 100 characters"})
const emailSchema=z.string().trim().email().max(100,{message:"Email should contain only 100 characters"})
export const verifyUserSchema=z.object({
    name:nameSchema
})

export const verifyPasswordSchema= z.object({
    currentPassword:z.string().min(1,{message:"Current Password is required"}),
    newPassword:z.string().min(6,{message:"New Password must be at least 6 characters long"}).max(100,{message:"New Password must be no more than 100 characters"}),
    confirmPassword:z.string().min(6,{message:"confirm Password must be at least 6 characters long"}).max(100,{message:"confirm Password must be no more than 100 characters"}),
}).refine((data)=>data.newPassword===data.confirmPassword,{
    message:"password dont match",
    path:["confirmPassword"]
})

export const forgetPasswordSchema=z.object({
    email: emailSchema
})

const passwordSchema=z.object({
        newPassword:z.string().min(6,{message:"New Password must be at least 6 characters long"}).max(100,{message:"New Password must be no more than 100 characters"}),
    confirmPassword:z.string().min(6,{message:"confirm Password must be at least 6 characters long"}).max(100,{message:"confirm Password must be no more than 100 characters"}),
}).refine((data)=>data.newPassword===data.confirmPassword,{
    message:"password dont match",
    path:["confirmPassword"]

})

export const resetPasswordSchema=passwordSchema
export const setPasswordSchema=passwordSchema