import { parse } from 'cookie'
import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyRefreshToken } from 'src/utils/token'
import { setCookie } from 'src/utils/setCookie'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE')
        return res.status(404)

    if (typeof req.headers.cookie === 'undefined')
        return res.status(403)

    const cookie = parse(req.headers.cookie)
    const refreshToken = cookie.__refresh_token__

    try {
        await verifyRefreshToken(refreshToken)
        setCookie(res, '__refresh_token__', '', { maxAge: -1 })
        res.status(200)
        res.json({ success: true })
    } catch (error) {
        res.status(403)
        res.json(error)
    }
}

