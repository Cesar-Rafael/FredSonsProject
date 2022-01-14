const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Initializations
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // ./views
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

app.use(cookieParser('random'));

app.use(express.json());

app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Routes

require('./routes/manager')(app);

app.get('*', function (req, res) {
    res.render('app/index')
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("Server Started At: http://localhost:" + PORT));