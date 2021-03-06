module.exports = {
    mongoUrl:  process.env.MONGODB_URI ||  'mongodb://127.0.0.1:27017/onem-zone',
    mongoRetry: process.env.MONGODB_RECONNECT_INTERVAL || 2000,
    httpPort: process.env.PORT || 5000,
    https: process.env.HTTPS || 'false',
}
