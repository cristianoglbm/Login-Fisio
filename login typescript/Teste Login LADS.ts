import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());

// Mock database
const users: { [email: string]: { nome: string; senha: string } } = {};

// Register endpoint
app.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    if (users[email]) {
        return res.status(400).json({ message: 'Usuário já existe' });
    }

    const hashedsenha = await bcrypt.hash(senha, 10);
    users[email] = { nome, senha: hashedsenha };

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ message: 'Preencha todos os campos' });
    }

    const user = users[email];
    if (!user) {
        return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    const issenhaValid = await bcrypt.compare(senha, user.senha);
    if (!issenhaValid) {
        return res.status(400).json({ message: 'Email ou senha inválidos' });
    }

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login bem sucedido', token });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});