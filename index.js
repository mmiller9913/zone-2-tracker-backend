require('dotenv').config({ path: '.env' });
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); //needed to prevent network error 
const app = express();
// const mysql = require('mysql');
const dateFunctions = require('./helper_functions/dateFunctions');
// const connectToDb = require('./connectToDb.js');

//MIDDLEWARE 
app.use(cors());  //needed to prevent network error 
app.use(express.json()); //converts every request body to JSON 
//these next two do the same thing
// app.use(express.urlencoded())
app.use(bodyParser.urlencoded({ extended: true }));

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

// db.connect((err) => {
//     if (err) {
//         console.log('Error connecting to database');
//     } else {
//         console.log('mySQL connected');
//     }
// });

// let db;
// async function connectToDatabase() {
//     try {
//     db = await connectToDb.connectToDb();
//     } catch (err) {
//         console.log('Error connecting to databse');
//     }
//   }
  
// connectToDatabase();

//log minutes to database
app.post('/api/logminutes', async (req, res) => {
    const email = req.body.account;
    const minutes = req.body.minutes;
    const sql = "INSERT INTO minutes_log(email, minutes) VALUES (?, ?)";
    db.query(sql, [email, minutes], (err, result) => {
        console.log(result);
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
})

//add user to databse 
app.post('/api/adduser', async (req, res) => {
    const email = req.body.email;
    const name = req.body.display_name;
    const sql = "INSERT INTO users(email, display_name) VALUES (?, ?)";
    db.query(sql, [email, name], (err, result) => {
        console.log(result);
        if (err) {
            console.log(err);
        }
    });
})

//user info 
app.get('/api/get/users/:email', (req, res) => {
    const sql = `SELECT * FROM users WHERE email = "${req.params.email}"`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    })
})

//get all users 
app.get('/api/get/users', (req, res) => {
    const sql = `SELECT * FROM users`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    })
})

//sum of weekly zone 2 minutes
const lastSunday = dateFunctions.getLastDayOccurence(new Date(), 'Sun'); //this is a date object in GMT time
const formattedLastSunday = lastSunday.toISOString().split('T')[0]; //converts to YYYY-MM-DD format
app.get('/api/get/weeklyzone2minutes/:email', (req, res) => {
    const sql = `
    SELECT SUM(minutes) 
    FROM minutes_log 
    WHERE email = "${req.params.email}"
    AND CONVERT_TZ(created_at, '+00:00', '-5:00') > '${formattedLastSunday}'`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(Object.values(result[0]));
    })
})

//get all weekly zone 2 sessions for a user
app.get('/api/get/weeklysessions/:email', (req, res) => {
    const sql = `
    SELECT *
    FROM minutes_log 
    WHERE email = "${req.params.email}"
    AND CONVERT_TZ(created_at, '+00:00', '-5:00') > '${formattedLastSunday}'`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    })
})

//delete a zone 2 session
//database stores created_at timestamp in est
//when get data from database, created_at is +4 hours 
app.post('/api/deletesession', (req, res) => {
    const email = req.body.account;
    const id = req.body.id;
    const sql = `
    DELETE 
    FROM minutes_log 
    WHERE email = '${email}'
    AND id = ${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
    })
})

//when testing
// app.listen('5000', () => {
//     console.log('Server started on port 5000')
// }) 

//when deploed to heroku
app.set('port', process.env.PORT || 5000);
const server = app.listen(app.get('port'), () => {
    console.log(`App started: Express running → PORT ${server.address().port}`);
});


//great tutorial for using react with node
//https://www.youtube.com/watch?v=3YrOOia3-mo

//notes
//database stores created_at timestamp in est
//when get data from database on frontend, created_at is +4 hours 