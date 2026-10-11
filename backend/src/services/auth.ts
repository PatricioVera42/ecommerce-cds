import bcrypt from "bcryptjs";
import { HttpError } from "../lib/http-error.js";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/jwt.js";

export async function register(data: {name: string, email: string, password: string}){
    
    const userExist = await prisma.user.findUnique({ where: { email: data.email } });
    if (userExist){
        throw new HttpError(409, "El email ya está registrado");
    }
    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: { name: data.name, email: data.email, passwordHash },
        select: {id: true, name: true, email: true, role: true },
    });

    const token = signToken({id: user.id, role: user.role});

    return { token, user };
}

export async function login(data: {email: string, password: string }){
    
    const user = await prisma.user.findUnique({ where: { email: data.email } });
     if (!user){
        throw new HttpError(401, "Email o contraseña incorrectos");        
     }

    const passwordMatches = await bcrypt.compare(data.password, user.passwordHash);
    if (!passwordMatches){
        throw new HttpError(401, "Email o contraseña incorrectos");        
    }
    
    const token = signToken({id: user.id, role: user.role});
    const { passwordHash, ...safeUser } = user;
    
    return { token, user: safeUser};
}

export async function getMe(id: string){

    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true, role: true } });
    if (!user){
        throw new HttpError(401, "Sesión inválida");
    }

    return {user};
}