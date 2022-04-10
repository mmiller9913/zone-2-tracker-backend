require('dotenv').config({ path: './env' });
const mysql = require('mysql');

exports.connectToDb = () => {
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection({
            // local
            host: 'localhost',
            user: 'root',
            password: process.env.MYSQL_PASSWORD_LOCAL,
            database: 'zone_2_tracker',
            // charset: 'utf8mb4'

            //heroku
        });
        db.connect((err) => {
            if (err) {
                reject(err);
            }
            console.log('mySQL connected');
        });
        resolve(db);
    })
}

