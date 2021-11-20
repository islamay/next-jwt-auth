import bcrypt from 'bcrypt'
import { user, Prisma } from '@prisma/client'
import { prisma } from 'src/utils/database';
import { createAccessToken, createRefreshToken } from 'src/utils/token'


interface CreateUserProps {
    username: string;
    email: string;
    avatar: string;
    password: string;
}

export interface CreateUserOutput {
    user: user,
    accessToken: string,
    refreshToken: string
}

export interface CreateUserErrorOutput {
    isError: true;
    errorMessage: string;
    errorCode: string;
}

const createUser = async ({
    username,
    email,
    avatar,
    password
}: CreateUserProps): Promise<CreateUserOutput> => {

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                avatar,
                password: (() => {
                    const hashedPassword = bcrypt.hashSync(password, 10)
                    return hashedPassword
                })()
            }
        })

        const accessToken = createAccessToken({ username: user.username, avatar: user.avatar })
        const refreshToken = createRefreshToken({ username: user.username, avatar: user.avatar })

        return {
            user: user,
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                // @ts-ignore: Unreachable code error
                const errorPhrase = error.meta.target.split('_')
                const errorTargetField = errorPhrase[1]
                const errorMessage = `${errorTargetField} Is Not Unique`

                throw {
                    isError: true,
                    errorCode: error.code,
                    errorMessage: errorMessage
                }
            }
        }

        throw {
            isError: true,
            errorMessage: 'Unknown Error',
            errorCode: 'Unknown'
        }
    }

}

export default createUser