import { prisma } from 'src/utils/database'

export const findUserByUsername = async (username: string) => {
    const user = await prisma.user.findFirst({
        where: {
            username: username
        }
    })



    return user
}