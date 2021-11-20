import _ from 'lodash'
import createUser, { CreateUserErrorOutput } from 'src/models/users/createUser'
import { setCookie } from 'src/utils/setCookie'
import type { NextApiRequest, NextApiResponse } from 'next'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST')
        return res.status(404).json({ message: 'Not Found' })

    const { username, email, avatar, password } = req.body
    if (!username || !email || !avatar || !password)
        return res.status(400).json({ message: 'Bad Request' })

    try {
        const user = await createUser({ username, email, avatar, password })

        setCookie(res, '__refresh_token__', user.refreshToken, { httpOnly: true, sameSite: true })
        res.status(201).json(user)
    } catch (err) {
        const error = err as CreateUserErrorOutput
        return res.status(500).json(error)
    }


}