import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { knex } from 'knex';

dotenv.config();

const app = express();

// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Database configuration
const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }
});

// Ishikawa routes
app.post('/api/ishikawa', async (req, res) => {
  try {
    const { titulo, setor, responsavel, data, causas } = req.body;
    
    const [id] = await db('ishikawa_analises').insert({
      titulo,
      setor,
      responsavel,
      data
    });

    for (const categoria in causas) {
      for (const causa of causas[categoria]) {
        await db('ishikawa_causas').insert({
          analise_id: id,
          categoria,
          descricao: causa.descricao
        });
      }
    }

    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar análise' });
  }
});

app.get('/api/ishikawa', async (req, res) => {
  try {
    const analises = await db('ishikawa_analises')
      .select('*')
      .orderBy('data', 'desc');

    for (const analise of analises) {
      const causas = await db('ishikawa_causas')
        .where('analise_id', analise.id)
        .select('*');

      analise.causas = causas.reduce((acc, causa) => {
        if (!acc[causa.categoria]) {
          acc[causa.categoria] = [];
        }
        acc[causa.categoria].push({
          categoria: causa.categoria,
          descricao: causa.descricao
        });
        return acc;
      }, {});
    }

    res.json(analises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar análises' });
  }
});

// Pareto routes
app.post('/api/pareto', async (req, res) => {
  try {
    const { titulo, setor, responsavel, data, causas } = req.body;
    
    const [id] = await db('pareto_analises').insert({
      titulo,
      setor,
      responsavel,
      data
    });

    for (const causa of causas) {
      await db('pareto_causas').insert({
        analise_id: id,
        descricao: causa.descricao,
        frequencia: causa.frequencia
      });
    }

    res.status(201).json({ id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao salvar análise' });
  }
});

app.get('/api/pareto', async (req, res) => {
  try {
    const analises = await db('pareto_analises')
      .select('*')
      .orderBy('data', 'desc');

    for (const analise of analises) {
      const causas = await db('pareto_causas')
        .where('analise_id', analise.id)
        .select('*');

      analise.causas = causas;
    }

    res.json(analises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar análises' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});