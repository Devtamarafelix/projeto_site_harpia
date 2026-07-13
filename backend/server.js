import 'dotenv/config';
import express, { json } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import conectarBanco from './database.js'

// configuração inicial do servidor
const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET;
const db = conectarBanco();

// validações
function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function senhaValida(senha) {
    return typeof senha === 'string' && senha.length >= 6;
}

// inicio do servidor
app.listen(3000, () => console.log("Servidor rodando na porta 3000!"))

// rota cadastro (POST)
app.post('/cadastro', async (req, res) => {
    try { 
        const { nome, nascimento, email, usuario, senha } = req.body;

        if (!nome || !nascimento || !email || !usuario || !senha) {
           return res.status(400).json({ error: "Preencha todos os campos." });
        }

        if(!emailValido(email)) {
           return res.status(400).json({ error: "Email invalido." });
       }

       if(!senhaValida(senha)) {
          return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres." });
       }

       const emailExistente = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
       if(emailExistente) {
          return res.status(400).json( { error: "Email já cadastrado." });
       } 

       const usuarioExistente = db.prepare('SELECT * FROM usuarios WHERE usuario = ?').get(usuario);
       if(usuarioExistente) {
          return res.status(400).json( { error: "Usuario já cadastrado." });
       }

       const senhaCriptografada = await bcrypt.hash(senha, 10)

       db.prepare(
          'INSERT INTO usuarios (nome, nascimento, email, usuario, senha) VALUES (?, ?, ?, ?, ?)'     
       ).run(nome, nascimento, email, usuario, senhaCriptografada);

      res.status(201).json( { message: "Usúario criado com sucesso!" });
   } catch (error) {
      console.log("Error em /register:", error)
      res.status(500).json({ error: "Erro interno ao cadastrar." });
     }

});

//rota login (POST)
app.post('/login', async (req, res) => {
    try {
        const { identificador, senha } = req.body;

        if (!identificador || !senha) {
            return res.status(400).json( { error: "Preencha todos os campos."})
        }

        const usuario = db.prepare (
            'SELECT * FROM usuarios WHERE email = ? OR usuario = ?'
        ).get (identificador, identificador);
        if (!usuario) {
            return res.status(400).json( { error: "Úsuario ou senha inválidos." });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(400).json( { error: "Úsuario ou senha inválidos." })
        }
            

        const token = jwt.sign(
            {id: usuario.id, email: usuario.email, usuario: usuario.usuario },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            menssage: "Login realizado com sucesso!",
            token,
            usuario: {
                nome: usuario.nome,
                usuario: usuario.usuario,
                email: usuario.email
            }
        });
    } catch (error) {
        console.log("Erro em /login", error);
        res.status(500).json({error:"Erro interno ao logar."});
    }
});

//rota esqueceu-senha
app.post('/esqueceu-senha', async (req, res) => {
    try {
        const {email, novaSenha} = req.body;

        if(!email || !novaSenha) {
            return res.status(400).json({ error: "Preencha todos os campos." });
        }

        if(!senhaValida(novaSenha)) {
            return res.status(400).json({ error: "A senha deve ter pelo menos 6 caracteres." });
        }

        const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);
        if (!usuario) {
            return res.status(400).json({ error: "Email não encontrado." });
        }

        const novaSenhaCriptografada = await  bcrypt.hash(novaSenha, 10);

        db.prepare('UPDATE usuarios SET senha = ? WHERE email = ?').run(novaSenhaCriptografada, email);

        res.json({message: "Senha redefinida com sucesso!"});
    } catch(error) {
        console.error("Erro em /esqueceu-senha:", error);
        res.status(500).json({error: "Erro interno ao redefinir senha."});
    }
});
