

// const resend = new Resend(process.env.RESEND_API)
// import dotenv from 'dotenv';
// dotenv.config({ path: './ExpressUrl/.env' }); // 👈 explicitly point to the correct location

// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API);
// export const sendEmail = async ({ to, subject, html }) => {
//   try {
//     const {data,error} = await resend.emails.send({
//       from:"Website <website@resend.dev>",
//       to:[to],
//       subject,
//       html,
//     })
//     if(error){
//         return   console.error(error)
//     }else{
//         console.log(data);
        
//     }
// }catch(error){
//     console.error(error)
// }

// }

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API); // Railway injects this automatically

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Website <website@resend.dev>",
      to: [to],
      subject,
      html,
    });

    if (error) {
      return console.error(error);
    } else {
      console.log(data);
    }
  } catch (error) {
    console.error(error);
  }
};