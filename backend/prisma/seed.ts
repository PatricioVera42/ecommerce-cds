import { copyFile, mkdir } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma.js";

await prisma.user.upsert({
    where: {email: "admin@tienda.com"},
    update: {},
    create: {
        name: "Admin",
        email: "admin@tienda.com",
        passwordHash: await bcrypt.hash("admin1234", 10),
        role: "ADMIN",
    },
});

if((await prisma.product.count()) === 0){
    await mkdir("uploads", { recursive: true });
    // Rayuela va sin imagen a propósito: sirve para probar el producto sin imagen.
    const products: { name: string; description: string; price: number; image?: string }[] = [
        { name: "Rayuela", description: "Novela de Julio Cortázar que se puede leer en más de un orden.",
            price: 2490 },
        { name: "La metamorfosis", description: "Franz Kafka. Gregor Samsa despierta convertido en un insecto.",
            price: 1590, image: "la-metamorfosis.jpg" },
        { name: "La República", description: "Platón. Diálogo sobre la justicia y el Estado ideal.",
            price: 2190, image: "la-republica.jpg" },
        { name: "Crimen y castigo", description: "Fiódor Dostoievski. Un estudiante comete un crimen y enfrenta su conciencia.",
            price: 2790, image: "crimen-y-castigo.jpg" },
        { name: "Guerra y paz", description: "León Tolstói. Varias familias rusas durante las guerras napoleónicas.",
            price: 3490, image: "guerra-y-paz.jpg" },
        { name: "Frankenstein", description: "Mary Shelley. Un científico da vida a una criatura y no puede controlarla.",
            price: 1890, image: "frankenstein.jpg" },
        { name: "Orgullo y prejuicio", description: "Jane Austen. Elizabeth Bennet y el señor Darcy, entre prejuicios y malentendidos.",
            price: 1990, image: "orgullo-y-prejuicio.jpg" },
        { name: "Los tres mosqueteros", description: "Alejandro Dumas. D'Artagnan y los mosqueteros del rey.",
            price: 2290, image: "los-tres-mosqueteros.jpg" },
        { name: "Don Quijote de la Mancha", description: "Miguel de Cervantes. Un hidalgo enloquece leyendo libros de caballería.",
            price: 2990, image: "don-quijote.jpg" },
        { name: "Moby Dick", description: "Herman Melville. El capitán Ahab persigue a la ballena blanca.",
            price: 2490, image: "moby-dick.jpg" },
    ];
    for (const p of products){
        let imageKey: string | null = null;
        if (p.image) {
            imageKey = randomUUID() + path.extname(p.image);
            await copyFile(path.join("prisma/seed-images", p.image), path.join("uploads", imageKey));
        }
        await prisma.product.create({
            data: {name: p.name, description: p.description, price: p.price, imageKey},
        });
    }
}

await prisma.$disconnect();