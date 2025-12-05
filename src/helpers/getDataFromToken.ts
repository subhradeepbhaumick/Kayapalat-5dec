import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
    try {
        const authHeader = request.headers.get("authorization");
        const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : '';
        const decodedToken:any = jwt.verify(token, process.env.JWT_SECRET!);
        return decodedToken.user_id;  // Fixed field name
    } catch (error: any) {
        throw new Error(error.message);
    }
}

