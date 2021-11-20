import jwt, { JwtPayload } from 'jsonwebtoken'
import _ from 'lodash'
const accessTokenSecret = 'secret'
const refreshTokenSecret = 'supersecret'

export interface Token {
    username: string;
    avatar: string;
}

export const createAccessToken = (payload: Token): string => {
    const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: '15m' })
    return accessToken
}

export const verifyAccessToken = async (accessToken: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(accessToken, accessTokenSecret, (err, decoded) => {
            if (!_.isEmpty(err))
                reject(err)

            resolve(decoded)
        })
    })
}

export const createRefreshToken = (payload: Token): string => {
    const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '30d' })
    return refreshToken
}

export const verifyRefreshToken = async (refreshToken: string): Promise<(JwtPayload) | undefined> => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
            if (!_.isEmpty(err))
                reject(err)


            resolve(decoded)
        })
    })
}
