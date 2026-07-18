import { DatabaseSync } from 'node:sqlite'
import path from 'path';
import os from 'os';

function conectarBanco() {
    // Cria o banco na raiz do usuário, fora da pasta 'nodejs'
    const dbPath = path.join(os.homedir(), 'banco.db');
    
    const db = new DatabaseSync(dbPath);
    console.log(`Banco de dados SQLite nativo conectado em: ${dbPath}`);
    //criação da tabela  
    db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,  --Chave primária: id númerico que vai ser criado sozinho pelo banco
        nome TEXT NOT NULL,                    
        nascimento TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,            -- campo obrigatório e único(não aceita dados duplicados)
        usuario TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        foto_perfil TEXT
      )     
    `);

    try {
    db.exec(`ALTER TABLE usuarios ADD COLUMN foto_perfil TEXT;`);
    console.log("Coluna 'foto_perfil' criada com sucesso no banco antigo!");
  } catch (error) {}

    return db;
}
//permite que a função seja importada em outros arquvios
export default conectarBanco;