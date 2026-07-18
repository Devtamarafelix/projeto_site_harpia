import 'dotenv/config';
import express, { json } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import conectarBanco from './database.js';
import multer from 'multer';
import path from 'path';
import os from 'os';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use(cors());

// Ajuste para não apagar fotos no deploy da Hostinger
const isHostinger = process.cwd().includes('nodejs');
const UPLOADS_DIR = isHostinger ? path.join(os.homedir(), 'uploads') : 'uploads/';

if (isHostinger && !fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.use('/uploads', express.static(UPLOADS_DIR));

const JWT_SECRET = process.env.JWT_SECRET;
const db = conectarBanco();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const nomeUnico = Date.now() + path.extname(file.originalname);
        cb(null, 'avatar-' + nomeUnico);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10mb
    }
});

function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function senhaValida(senha) {
    return typeof senha === 'string' && senha.length >= 6;
}

function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acesso Negado. Token não fornecido' });
    }

    try {
        const decodificado = jwt.verify(token, JWT_SECRET);
        req.user = decodificado;  
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
}

app.put('/perfil/avatar', verificarToken, upload.single('avatar'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Por favor, envie um arquivo de imagem válido." });
        }

        const userId = req.user?.id || req.user?.usuarioId;

        if (!userId) {
            return res.status(401).json({ error: "Usuário não identificado no token de autorização." });
        }

        const urlDaFoto = `/uploads/${req.file.filename}`;

        const comando = db.prepare('UPDATE usuarios SET foto_perfil = ? WHERE id = ?');
        comando.run(urlDaFoto, userId);

        return res.status(200).json({ 
            mensagem: "Foto de perfil atualizada com sucesso!", 
            foto: urlDaFoto 
        });

    } catch (error) {
        console.error("Erro na rota /perfil/avatar:", error);
        return res.status(500).json({ error: "Ocorreu um erro interno no servidor." });
    }
});

app.use((err, req, res, next) => {
    console.error("Erro capturado no middleware global:", err);

    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'O arquivo é muito grande. O limite máximo é de 10 MB' });
        }
    }
    return res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
});

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
                email: usuario.email,
                nascimento: usuario.nascimento,
                foto_perfil: usuario.foto_perfil
            }
        });
    } catch (error) {
        console.log("Erro em /login", error);
        res.status(500).json({error:"Erro interno ao logar."});
    }
});

// inicio do servidor
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => console.log(`Servidor rodando na porta ${PORTA}!`));
