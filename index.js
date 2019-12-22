var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shila31aug',
    database: 'BooksDB',
});

connection.connect(function(err) {
    if(err){
        console.log(err.code);
        console.log(err.fatal);

    }
});

$query = 'SELECT * FROM `Category`';

connection.query($query, function(err, rows, fields) {
    if (err) {
        console.log('an error has occured');
        console.log(err.code);
        return;
    }
    console.log("query successful.", rows);
});

connection.end(function() {

});

