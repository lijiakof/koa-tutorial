const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'test-space1bjs.cvrlck3hdzic.rds.cn-north-1.amazonaws.com.cn',
    port: 3306,
    user: 'ecotech',
    password: 'iesjo9um',
    database: 'space_database'
});

con.connect();

con.query('SELECT * FROM `TEAM_BUILDING` LIMIT 0, 10;', (err, res, fields) => {
    
    console.log(err);
    console.log(res);
})