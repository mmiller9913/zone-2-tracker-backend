require('dotenv').config({ path: './env' });
const mysql = require('mysql');

exports.connectToDb = () => {
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection({
            // local
            // host: 'localhost',
            // user: 'root',
            // password: process.env.MYSQL_PASSWORD_LOCAL,
            // database: 'zone_2_tracker',
        
            //heroku
            host: 'us-cdbr-east-05.cleardb.net',
            user: 'b5e8c7635e0a90',
            password: process.env.MYSQL_PASSWORD_HEROKU,
            database: 'heroku_49aaaee3ed47db2',
        });
        db.connect((err) => {
            if (err) {
                reject(err);
                console.log.log('Error connecting to database')
            } else {
                console.log('mySQL connected');
            }
        });
        resolve(db);
    })
}

