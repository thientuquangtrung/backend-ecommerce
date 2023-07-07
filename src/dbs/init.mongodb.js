const { default: mongoose } = require("mongoose");
const { countConnections } = require('../helpers/check.connect')
const { db: {host, port, name} } = require('../configs/config.mongodb')

const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
    constructor() {
        this.connect();
    }

    // connect
    connect(type = "mongodb") {
        if (1 === 1) {
            mongoose.set("debug", true);
            mongoose.set("debug", { color: true });
        }

        mongoose
            .connect(connectString)
            .then((_) => console.log(`Connect mongodb success`, countConnections()))
            .catch((error) => console.log(`Connect error: ${error}`));
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb
