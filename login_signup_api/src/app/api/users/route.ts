import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// import Email from "next-auth/providers/email";

const prisma = new PrismaClient();

export async function GET() {
 try{
const  user = await prisma.user.findMany({
    select: { 
        id: true, 
        email: true, 
        password: true,
        api: true,
        createdAt: true 
    }
});

if (user.length === 0) {
    return NextResponse.json({ message: "No data found" });
}

return NextResponse.json(user);


 }catch(err){
    console.log("Error fetching data", err)
    return NextResponse.json({
        error: "Failed to fetch users"  
    
    })

 }
}
 