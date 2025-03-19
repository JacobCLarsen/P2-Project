import mysql from "mysql";

const DBConnection = mysql.createConnection({
    host: 'localhost',
    user: 'cs-25-sw-2-01@student.aau.dk',
    password: 'mye7cahHm8/AWd%q',
    database: 'cs_25_sw_2_01'
});

DBConnection.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected!');
});
