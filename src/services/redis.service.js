const redis = require("redis");
const redisClient = redis.createClient();
const { promisify } = require("util");
const {
    reservationInventory,
} = require("../models/repositories/inventory.repo");

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnx = promisify(redisClient.setNX).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_2023_${productId}`;
    const retryTimes = 10;
    const expireTime = 3000; // 3 seconds

    for (let index = 0; index < retryTimes; index++) {
        const result = await setnx(key, expireTime);

        if (result) {
            // modify inventory
            const isReservation = await reservationInventory({
                productId,
                cartId,
                quantity,
            });

            if (isReservation.modifiedCount) {
                await pexpire(key, expireTime);
                return key; //to release lock
            }

            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
};

const releaseLock = async (key) => {
    const delKey = promisify(redisClient.del).bind(redisClient);
    return await delKey(key);
};

module.exports = {
    acquireLock,
    releaseLock,
};
