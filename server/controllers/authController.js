const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path')
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '.env') })

const db = mysql.createConnection({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

  
const loginUser = async (req, res) => {
    try {
      
        const { username, password } = req.body;
       

       
        db.query(
            'SELECT * FROM users WHERE username = ?',
            [username],
            (err, results) => {
                if (err) {
                    throw err;
                }
                
                if (results.length === 0) {
                    return res
                    .status(401)
                    .json({ message: 'Username or password is invalid' });
                }
                
                bcrypt.compare(password, results[0].password, (err, match) => {
                    if (err) {
                        throw err;
                    }
                    
                    if (!match) {
                        return res
                        .status(401)
                        .json({ message: 'Username or password is invalid' });
                    }
                    
                    // Gerar um token JWT
                    const token = jwt.sign({ username: results[0].username,user_id:results[0].id }, 'jwt', {
                        expiresIn: '1h',
                    });
                    console.log(`Wygenerowano token na 1h dla: ${results[0].username}`);
                    
                    res.status(200).json({ token });
                });
            }
        );
        
    } catch (err) {
        console.log(err)
        return res
        .status(500)
        .json({ message: 'Wystąpił błąd podczas odpytania bazy danych' });
    }
      
  };

module.exports = {loginUser};