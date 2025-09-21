import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    await prisma.user.create({
        data: {
            name: "Kyle",
            age: 10,
            email: "kyle@gmail.com"


        }
    })
}

main()
    .catch(e => {
        console.error(e.message)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })