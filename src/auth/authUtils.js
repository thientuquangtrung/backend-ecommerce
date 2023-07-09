const JWT = require('jsonwebtoken');
const { NotFoundError, AuthFailureError } = require('../core/error.response');
const asyncHandler = require('../helpers/asyncHandler');
const { findByUserId } = require('../services/keyToken.service');

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days',
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days',
        })

        JWT.verify(accessToken, publicKey, (error, decode) => {
            if (error) {
                console.error(`error verifying: ${error}`);
            }
            else {
                console.log(`decoded value: ${decode}`);
            }
        })

        return { accessToken, refreshToken  }
    } catch (error) {
        
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /**
     * 1 - check userId
     * 2 - get access token
     * 3 - verify access token
     * 4 - check user in db
     * 5 - check keyStore with this user
     * 6 - return next() if OK
     */

    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError(`Invalid request`)

    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError(`Keystore not found`)

    // below token can be either access token or refresh token
    const token = req.headers[HEADER.AUTHORIZATION]
    if (!token) throw new AuthFailureError(`Invalid request`)

    const decodeUser = JWT.verify(token, keyStore.publicKey)
    if (userId !== decodeUser.userId) throw new AuthFailureError(`Invalid user`)
    req.keyStore = keyStore
    req.token = token
    req.user = decodeUser
    return next()
})

module.exports = {
    createTokenPair,
    authentication
}