const _ = require("lodash");
const crypto = require("crypto");

const getInfoData = ({ fields = [], object }) => {
    return _.pick(object, fields);
};

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUnexpectedObject = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] === null || obj[key] === undefined) {
            delete obj[key];
        }
    });

    return obj;
};

const updateNestedObject = obj => {
    const final = {}
    Object.keys(obj).forEach((key) =>{
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObject(obj[key])
            Object.keys(response).forEach(k => {
                final[`${key}.${k}`] = response[k]
            })
        }else {
            final[key] = obj[key]
        }
    })

    return final
}

const generatePubPriKey = () => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
        },
        privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
        },
    });

    return { publicKey, privateKey };
};

module.exports = {
    getInfoData,
    generatePubPriKey,
    getSelectData,
    getUnSelectData,
    removeUnexpectedObject,
    updateNestedObject
};
