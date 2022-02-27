const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const mysql = require('mysql')
require('dotenv').config()


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000
}));

app.get('/', (req, res) => {
    res.send(new Date().toDateString('dd/MM/yyy'));
})

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'crud_operation',
    multipleStatements: true,
})

// ! db connection check
db.connect(err => {
    if (!err) {
        console.log('db connect successfully')
    }
    else {
        console.log('db connection failed')
    }
})

//! post user info to db
app.post('/user_create', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.pass
    db.query(
        "INSERT INTO user_collection (name, email, password) VALUES (?,?,?)",
        [name, email, password],
        (err, result) => {
            if (!err) {
                console.log(result);
                res.send(result);
            }
            else {
                console.log(err);
            }
        }
    )
})


//! get users collection from db
app.get('/user_list', (req, res) => {
    db.query(
        "SELECT * FROM user_collection",
        (err, result) => {
            if (!err) {
                res.send(result)
            }
            else {
                res.send(err)
            }
        }
    )
})

// ! get single user info from db
app.get('/single_user_info/:id', (req, res) => {
    const singleUser = req.params.id;
    db.query(
        "SELECT * FROM user_collection WHERE email = ?", singleUser,
        (err, result) => {
            if (!err) {
                res.send(result[0])
            }
            else {
                res.send(err);
            }
        }
    )
})

// ! edit single user info from db
app.get('/Edit_user_info/:id', (req, res) => {
    const userId = req.params.id;
    db.query(
        "SELECT * FROM user_collection WHERE id = ?", userId,
        (err, result) => {
            if (!err) {
                res.send(result[0])
            }
            else {
                res.send(err);
            }
        }
    )
})

// ! update an user
app.put('/update_user_info/:id', (req, res) => {
    const updateInfo = req.body;
    const updateId = req.params.id;
    db.query(
        "UPDATE user_collection SET ? WHERE id=?",
        [updateInfo, updateId],
        (err, result) => {
            if (!err) {
                res.send(result)
            }
            else {
                res.send(err);
            }
        }
    )
})

//! user delete from db
app.delete('/delete_user/:id', (req, res) => {
    const deleteUser = req.params.id;
    db.query(
        "DELETE FROM user_collection WHERE id = ?", deleteUser,
        (err, result) => {
            if (!err) {
                res.send(result)
            }
            else {
                res.send(err)
            }
        }
    )
})

const port = 1234;
app.listen(process.env.PORT || port, () => {
    console.log(`port listening : ${port}`)
})