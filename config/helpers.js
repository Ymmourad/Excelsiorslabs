const MySqli = require('mysqli');

let conn = new MySqli({
    host: 'localhost',
    post: 3306,
    user: 'root',
    password: 'password',
    db: 'excelsiorslabs'

});

let db = conn.emit(false, '');

module.exports = {
    database: db
};