const UserRouter = require('./UserRouter');
const MessageRouter = require('./MessageRouter');

const routes = (app) => {
    app.use('/api/user', UserRouter);
    app.use('/api/messages', MessageRouter);
};

module.exports = routes;
