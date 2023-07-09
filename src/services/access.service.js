const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData, generatePubPriKey } = require("../utils");
const {
    BadRequestError,
    ConflictRequestError,
    AuthFailureError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN",
};

class AccessService {

    static logout = async (keyStore) => {
        return await KeyTokenService.removeById(keyStore._id)
    }

    static login = async ({email, password, refreshToken = null}) => {
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new BadRequestError(`Shop has not registered`)

        const match = await bcrypt.compare(password, foundShop.password)
        if (!match) throw new AuthFailureError(`Authentication failed`)

        // re-create private key and public key
        const { publicKey, privateKey } = generatePubPriKey();

        // create tokens
        const tokens = await createTokenPair(
            { userId: foundShop._id, email },
            publicKey,
            privateKey
        );

        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            refreshToken: tokens.refreshToken,
            publicKey,
        });

        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: foundShop,
            }),
            tokens,
        };
    }

    static signUp = async ({ name, email, password }) => {
        // check existing email
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) {
            throw new ConflictRequestError("Error: Shop already registered!");
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
            const { publicKey, privateKey } = generatePubPriKey();

            const publicKeyString = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey,
            });

            if (!publicKeyString) {
                throw new BadRequestError("publicKeyString error");
            }

            // create tokens
            const tokens = await createTokenPair(
                { userId: newShop._id, email },
                publicKeyObject,
                privateKey
            );

            return {
                shop: getInfoData({
                    fields: ["_id", "name", "email"],
                    object: newShop,
                }),
                tokens,
            };
        }

        return {
            code: 200,
            metadata: null,
        };
    };
}

module.exports = AccessService;
