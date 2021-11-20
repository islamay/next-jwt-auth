import { parse } from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import { createAccessToken, verifyRefreshToken } from 'src/utils/token'
import { JwtPayload } from 'jsonwebtoken'
import { Token } from 'src/utils/token'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(1);
    const rawCookie = req.headers.cookie

    if (typeof rawCookie === 'undefined')
        return res.status(400).send('Bad Request')

    console.log(2);
    const cookie = parse(rawCookie)
    const refreshToken = cookie.__refresh_token__

    if (!refreshToken)
        return res.status(400).send('Bad Reqeuest')
    console.log(3);

    try {
        const decoded = await (await verifyRefreshToken(refreshToken)) as JwtPayload & Token
        const { avatar, username } = decoded
        const accessToken = createAccessToken({ avatar: decoded.avatar, username: decoded.username })

        res.status(200).json({ accessToken })
    } catch (error) {
        console.log(4);
        res.status(400)
        res.json(error)
    }


}


