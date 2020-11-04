const connection = require('../../config/MysqlConfig');

class Login {

  check(username,password) {
    
    const table = process.env.TABLE; // pega a tabela nas variaveis de ambiente
    
    return new Promise((resolve, reject) => {
      
      // console.log(`SELECT email, password FROM ${table} WHERE email = '${username}' AND password = '${password}'`);

      connection.query(`SELECT email, password FROM ${table} WHERE email = '${username}' AND password = '${password}'`, (err, res) => {

          if((err)) {
            
            console.log(err); 
            reject(err);
          
          } else {

            console.log(res.length); 
            if(res.length >= 1) { 
              resolve(true); 
            } else {
              reject("Usuário e/ou senha inválidos");
            }

          }
      });

    });
    
  };
  
}

module.exports = new Login();
