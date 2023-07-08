const shopModel = require("../models/shop.model");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // check existing email
            const holderShop = await shopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    message: "Shop already exists",
                };
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const newShop = await shopModel.create({
                name,
                email,
                password: hashPassword,
                roles: [RoleShop.SHOP],
            });

            if (newShop) {
                // create public key and private key
                const { publicKey, privateKey } = crypto.generateKeyPairSync(
                    "rsa",
                    {
                        modulusLength: 4096,
                        publicKeyEncoding: {
                            type: "pkcs1",
                            format: "pem",
                        },
                        privateKeyEncoding: {
                            type: "pkcs1",
                            format: "pem",
                        },
                    }
                );

                console.log({ publicKey, privateKey });

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                });

                if (!publicKeyString) {
                    return {
                        message: "publicKeyString error",
                    };
                }

                // covert public keys from db (string) to rsa
                const publicKeyObject = crypto.createPublicKey(publicKeyString);

                // create tokens
                const tokens = await createTokenPair(
                    { userId: newShop._id, email },
                    publicKeyObject,
                    privateKey
                );
                console.log(`Create tokens: ${tokens}`);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({
                            fields: ['_id', 'name', 'email'],
                            object: newShop
                        }),
                        tokens,
                    },
                };
            }

            return {
                code: 200,
                metadata: null,
            };
        } catch (error) {
            return {
                message: error.message,
            };
        }
    };
}

module.exports = AccessService;
