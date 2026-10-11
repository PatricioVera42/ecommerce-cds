import jwt from "jsonwebtoken";
import { env } from "./env.js";

export function signToken(data: {id: string, role: string}){
    return jwt.sign({ sub: data.id, role: data.role },env.JWT_SECRET,{algorithm: "HS256",expiresIn: "1d" });
}