const JWT = require('jsonwebtoken');

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

module.exports = {
    createTokenPair
}