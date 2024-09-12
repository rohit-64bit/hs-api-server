const express = require('express');
const app = express();
const cors = require('cors');

const apiPrefix = `/api/${process.env.API_VERSION}`;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors())

app.get('/', (req, res) => {
    res.redirect(process.env.CLIENT_URL);
})

app.use(`${apiPrefix}/admin`, require('./routes/admin.routes'));

app.use(`${apiPrefix}/user`, require('./routes/user.routes'));

app.use(`${apiPrefix}/meeting`, require('./routes/meeting.routes'));

module.exports = app;