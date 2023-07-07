const { default: mongoose } = require("mongoose");
const os = require("os");
const process = require("process");

const _SECONDS = 5000

const countConnections = () => {
    const numConnect = mongoose.connections.length;
    console.log(`Number of connections: ${numConnect}`);
}

const checkOverLoad = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss

        // Example of maximum connections based on number of cores
        const maxConnections = numCores * 5;

        console.log(`Active connections: ${numConnections}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

        if (numConnections > maxConnections) {
            console.log(`Connections overload detected`);
            // notification
        }
    }, _SECONDS)
}

module.exports = {
    countConnections,
    checkOverLoad
}