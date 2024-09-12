require('dotenv').config({
    path: './config/.env'
});

const app = require('./app');
const connectDB = require('./config/db');
const io = require('./socket');

const PORT = process.env.PORT;
const SOCKET_PORT = process.env.SOCKET_PORT;

connectDB();

io.listen(SOCKET_PORT, {
    cors: true
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})