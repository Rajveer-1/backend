const mongoose = require('mongoose')
const express = require('express')
const app = express()
const ejs = require('ejs')
const mongooseClient = require('./connectmonogose')
mongooseClient();
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

port=3000
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
      });