const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    DB: {
        uri: process.env.DBPORT || 'mongodb://localhost:27017/MyDb' ,
        options: {useNewUrlParser: true, }
    },
    PORT: process.env.PORT
};