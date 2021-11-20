import type { NextApiRequest } from 'next'

export const parseAuthHeader = (req: NextApiRequest) => {
    const rawHeader = req.headers.authorization

    if (typeof rawHeader === 'undefined')
        return false


}
