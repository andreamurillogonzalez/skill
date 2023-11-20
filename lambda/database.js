const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const dbConnection = () => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD,
            database: process.env.DATABASE,
            port: process.env.PORT
        });

        connection.connect((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(connection);
        });
    });
};

module.exports = {
    dbConnection
};
