import * as bcrypt from 'bcrypt'
import { findUserByUsername } from 'src/models/users/findUser'
import { setCookie } from 'src/utils/setCookie'
import { createAccessToken, createRefreshToken } from 'src/utils/token'
import type { NextApiRequest, NextApiResponse } from 'next'

const validatePassword = (plain: string, hashed: string) => {
    const isValidated = bcrypt.compareSync(plain, hashed)
    console.log(isValidated);

    return isValidated
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST')
        return res.status(404).send('Not Found')

    const { username, password } = req.body
    if (!username || !password)
        return res.status(400).send('Bad Request')

    const user = await findUserByUsername(username)
    if (user === null)
        return res.status(404).send('User Not Exist')


    const isValidated = validatePassword(password, user.password)
    if (!isValidated)
        return res.status(401).send('Unauthorized')

    const refreshToken = createRefreshToken({ avatar: user.avatar, username: user.username })
    const accessToken = createAccessToken({ avatar: user.avatar, username: user.username })

    setCookie(res, '__refresh_token__', refreshToken, { httpOnly: true, sameSite: true })
    res.status(200)
    res.json({ accessToken: accessToken })
}

