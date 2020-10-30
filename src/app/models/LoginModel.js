const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
// const database = require('../../config/MysqlConfig');
// const IbridgeMiddleware = require('../middlewares/IbridgeMiddleware');

class Login {
  
  index() {
    
    /* index: retorna todos registros */
    
    const table = process.env.TABLE_APOSENTAJA; // pega a tabela nas variaveis de ambiente
    
    return new Promise((resolve, reject) => {
      
      config.query(`SELECT * FROM ${table}`, (err, res) => {
        
        // verifica o número registros encontrados, se for maior que 1, então retorna no JSON
        // do contrário retorna o erro
        
        if (res.length >= 1) {
          
          if (err) reject({
            "status": false,
            "message": err
          })
          else resolve({
            "status": true,
            "message": res
          });
          
        } else {
          
          // se não for encontrado registros, mostra que não há registros
          // ou o erro na hora da consulta
          
          if (err) reject({
            "status": false,
            "message": err
          })
          else resolve({
            "status": false,
            "message": "0 registros encontrados"
          });
          
        }
        
      });
      
    });
    
  }
  
  show(guid) {
    
    /* show: passando o guid na url retorna apenas o registro procurado */
    
    const table = process.env.TABLE_APOSENTAJA; // pega a tabela nas variaveis de ambiente
    
    return new Promise((resolve, reject) => {

      database.query(`SELECT * FROM ${table} WHERE guid LIKE '${guid}'`)

      .then((rows) => {

        if(rows.length >= 1) {

          try {
            resolve({
              "status": true,
              "message": rows
            });
          } catch (error) {
            reject({
              "status": false,
              "message": error
            });
          }
          
        } else {

          try {
            resolve({
              "status": false,
              "message": "Registro não encontrado"
            });
          } catch (error) {
            reject({
              "status": false,
              "message": error
            });
          }

        }

      });
      
    }); // promise
    
  }
  
  store(body) {
    
    /* store: cria um novo registro no banco, necessario passar via body */
    
    const table = process.env.TABLE_APOSENTAJA; // pega a tabela nas variaveis de ambiente
    
    // recupera os dados do body e formata cada campo se necessário
    
    const uuid = uuidv4();
    const nome = body.nome;
    const email = body.email;
    const dataDeNascimento = body.dataDeNascimento;
    const telefoneFixoCelular = body.telefoneFixoCelular;
    const sexo = body.sexo;
    const jaTrabalhou = body.jaTrabalhou;
    const url = body.url;
    const aff_id = body.aff_id;
    
    return new Promise((resolve, reject) => {
      
      config.query(`INSERT INTO leads (id, guid, nome, email, telefone_fixo_celular, data_de_nascimento, sexo, ja_trabalhou, contratos, finish, url, aff_id, timestamp) VALUES (NULL, '${uuid}', '${nome}', '${email}', '${telefoneFixoCelular}', '${dataDeNascimento}', '${sexo}', '${jaTrabalhou}', '', 'Não', '${url}', '${aff_id}', CURRENT_TIMESTAMP);`,
      
      (err,res) => {
        
        if (err) {
          reject({"status": false,"sql": err}); 
          
        } else {
          
          IbridgeMiddleware.insert(res.insertId,nome,email,telefoneFixoCelular,dataDeNascimento,sexo,jaTrabalhou)

          .then((response) => {
            resolve({"status": true, "guid": uuid, "sql": res, "ibridge": response});

          })

          .catch((error) => {
            reject(error);

          });
          
        }
        
      });
      
    });
    
  }
  
  update(body,guid) {
    
    /* update: atualiza o registro, necessário passar todos os campos e dados via body e o id do registro via url */
    
    const table = process.env.TABLE_APOSENTAJA; // pega a tabela nas variaveis de ambiente
    
    // recupera os campos que vieram através do body e se necessário formata usando os helpers
    
    const nome = body.nome;
    const email = body.email;
    const dataDeNascimento = body.dataDeNascimento;
    const telefoneFixoCelular = body.telefoneFixoCelular;
    const sexo = body.sexo;
    const url = body.url;
    const aff_id = body.aff_id;
    
    return new Promise((resolve, reject) => {
      
      config.query(`UPDATE ${table} SET nome = '${nome}', email = '${email}', telefone_fixo_celular = '${telefoneFixoCelular}', data_de_nascimento = '${dataDeNascimento}', sexo = '${sexo}', url = '${url}', aff_id = '${aff_id}' WHERE guid = '${guid}';`,
      
      (err, res) => {
        
        if (err) {
          
          reject({
            "status": false,
            "message": err
          }); 
          
        } else {
          
          // caso o registro informado para update não seja encontrado, não faz nada 
          // e retorna que não foi encontrado
          
          if(res.affectedRows == 0) {
            
            resolve({
              "status": false,
              "message": "Registro não encontrado",
              // "sql": res // debug
            });
            
          } else {
            
            // caso o registro seja encontrado, após atualizar retorna a mensagem de sucesso
            
            resolve({
              "status": true,
              "message": "Registro atualizado com sucesso",
              // "sql": res // debug
            });
            
          }
          
        }
        
      });
      
    });
    
  }
  
  destroy(guid) {
    
    /* destroy: apaga o registro, necessário passar o id do registro via url */
    
    const table = process.env.TABLE_APOSENTAJA; // pega a tabela nas variaveis de ambiente
    
    return new Promise((resolve, reject) => {
      
      config.query(`DELETE FROM ${table} WHERE guid = '${guid}'`, (err, res) => {
        
        // caso aconteça algum erro com a query, retorna o erro
        
        if (err) {
          
          reject({
            "status": false,
            "message": err
          }); 
          
        } else {
          
          // caso não tenha sido afetado nenhum registro, é porque não encontrou o registro pra ser apagado
          // então devolve que não foi encontrado registro
          
          if(res.affectedRows == 0) {
            
            resolve({
              "status": false,
              "message": "Registro não encontrado",
              // "sql": res // debug
            });
            
          } else {
            
            // caso tenha sido encontrado, mostra a mensagem que foi apagado
            
            resolve({
              "status": true,
              "message": "Registro apagado com sucesso",
              // "sql": res // debug
            });
            
          }
          
        }
        
      });
      
    });
    
  }
  
  findOne(email) {
    
    /* findOne: passando o id na url retorna apenas o registro procurado */
    
    const table = process.env.TABLE_APOSENTAJA; // pega a tabela nas variaveis de ambiente
    
    return new Promise((resolve, reject) => {
      
      config.query(`SELECT email FROM ${table} WHERE email LIKE '${email}'`, (err, res) => {
        
        // se encontrar 1 registro, mostra ele na resposta ou erro da consulta
        
        if (res.length >= 1) {
          
          if (err) reject({
            "status": false,
            "message": err
          })
          else resolve({
            "status": true,
            "message": res
          });
          
        } else {
          
          if (err) reject({
            "status": false,
            "message": err
          })
          else resolve({
            "status": false,
            "message": "Usuário não encontrado, pode inserir"
          });
          
        }
        
      });
      
    });
    
  }
  
  findByGuid(guid) {
    
    /* findOne: passando o id na url retorna apenas o registro procurado */
    
    const table = process.env.TABLE_APOSENTAJA; // pega a tabela nas variaveis de ambiente
    
    return new Promise((resolve, reject) => {
      
      config.query(`SELECT guid FROM ${table} WHERE guid LIKE '${guid}'`, (err, res) => {
        
        // se encontrar 1 registro, mostra ele na resposta ou erro da consulta
        
        if (res.length >= 1) {
          
          if (err) reject({
            "status": false,
            "message": err
          })
          else resolve({
            "status": true,
            "message": res
          });
          
        } else {
          
          if (err) reject({
            "status": false,
            "message": err
          })
          else resolve({
            "status": false,
            "message": "Usuário não encontrado, pode inserir?"
          });
          
        }
        
      });
      
    });

  }
  
}

module.exports = new Login();
