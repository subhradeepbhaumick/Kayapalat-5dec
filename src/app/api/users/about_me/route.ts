import { getDataFromToken } from "@/helpers/getDataFromToken";

import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { Connect } from "@/dbConfig/dbConfig";


export async function GET(request:NextRequest){

    try {
        console.log("🔗 Connecting to MongoDB...");
        await Connect(); // Establish DB connection
    
        console.log("✅ MongoDB Connected Successfully");



        const userId = await getDataFromToken(request);
        const user = await User.findOne({_id: userId}).select("-password");
        return NextResponse.json({
            mesaaage: "User found",
            data: user
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}