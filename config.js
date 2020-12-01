const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    DB: {
        uri: process.env.DBPORT ,
        options: {useNewUrlParser: true, }
    },
    PORT: process.env.PORT
};