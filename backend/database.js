import { DatabaseSync } from 'node:sqlite'

function conectarBanco() {
    const db = new DatabaseSync('./banco.db');    // vai criar o arquivo "banco.db" na raiz da pasta backend
    console.log("banco de dados SQLite nativo conectado com sucesso!")

    //criação da tabela  
    db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,  --Chave primária: id númerico que vai ser criado sozinho pelo banco
        nome TEXT NOT NULL,                    
        nascimento TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,            -- campo obrigatório e único(não aceita dados duplicados)
        usuario TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL 
      )     
    `);

    return db;
}
//permite que a função seja importada em outros arquvios
export default conectarBanco;