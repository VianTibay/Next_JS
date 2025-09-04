// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// // import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";


// const SECRET_KEY = process.env.JWT_SECRET || "SecretKey";



// const prisma = new PrismaClient();




// export async function POST(req: Request) {
//   try {

// const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

//     const { email, password } = await req.json();

// const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.GMAIL,
//         pass: process.env.PASSWORD,
//       },
//     });
//      await transporter.sendMail({
//       from: `"MyApp Security" <${process.env.GMAIL_USER}>`,
//       to: email,
//       subject: "Login Verification Code",
//       text: `Your verification code is: ${verificationCode}`,
//       html: `<h2>Login Verification</h2><p>Your code is: <b>${verificationCode}</b></p>`,
//     });





    

//     const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

// const users = await prisma.user.findMany();

// const user = await prisma.user.findUnique({ where: { email } });
// if(users.length === 0 ){
// return NextResponse.json({error:"No users found in database. Please sign up first."},{status:404})
// }

//     if (!user) {
//       return NextResponse.json(
//         { error: "Invalid Email" }, 
//         { status: 404 }
//       );
//     }

//     // const isValid = await bcrypt.compare(password, user.password);
//     // if (!isValid) {
//     //   return NextResponse.json({ error: "Invalid Password" }, { status: 401 });
//     // }

// if (!user || user.password  != password) {
//   return NextResponse.json(
//     {
//       error: "Invalid password",
//       status: 401
//     }
//   )
// }







// const response  = NextResponse.json({ message: "Login successful", user });
//  response.cookies.set("token", token, { httpOnly: true, path: "/" });



// return NextResponse.json({
//       message: "Login successful. Verification code sent to your email.",
//       user: {
//         id: user.id,
//         email: user.email,
//         api: user.api,
//       },
//     });

//     return response;
//   } catch (error) {
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const SECRET_KEY = process.env.JWT_SECRET || "SecretKey";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // ✅ Check kung may user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid Email" }, { status: 404 });
    }

    // ✅ Check password (plain, dapat bcrypt compare dito)
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid Password" }, { status: 401 });
    }

    // ✅ Generate JWT
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });

    // ✅ Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Send email with nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL, // make sure .env.local has GMAIL
        pass: process.env.PASS, // and GMAIL_PASS
      },
    });

    await transporter.sendMail({
      from: `"MyApp Security" <${process.env.GMAIL}>`,
      to: email,
      subject: "Login Verification Code",
      text: `Your verification code is: ${verificationCode}`,
      html: `<h2>Login Verification</h2><p>Your code is: <b>${verificationCode}</b></p>`,
    });

    // ✅ Set cookie + return
    const response = NextResponse.json({
      message: "Login successful. Verification code sent to your email.",
      verificationCode, // 🔥 TEMPORARY: remove in prod, just for testing
      user: {
        id: user.id,
        email: user.email,
        api: user.api,
      },
    });

    response.cookies.set("token", token, { httpOnly: true, path: "/" });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
