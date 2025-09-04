
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
//import { fromTheme } from "tailwind-merge";

export async function POST(req:Request){
try{
const {to,sub,txt} = await req.json();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const mailOptions = {
from: process.env.GMAIL,
to,sub,txt,
};
await transporter.sendMail(mailOptions);


return NextResponse.json({success: true, msg: "email sent"});



}catch (error){

    return NextResponse.json({success: false, msg: "email not sent",status:400});

}

}