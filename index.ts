import cors from 'cors';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import path from 'path';
import userRoutes from './UserRoutes';

export const app = express();

app.use(express.json());
app.use(cors());
app.get('/', (_req, res) => {
  res.status(200).json({
    service: 'user-api',
    status: 'running',
    endpoints: {
      health: '/health',
      users: '/api/users',
    },
  });
});
app.use('/api', userRoutes);
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'user-api' });
});

function readEnvFile(): string {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    return '';
  }
  return fs.readFileSync(envPath, 'utf8').trim();
}

function readEnvValue(name: string): string | undefined {
  if (process.env[name]) {
    return process.env[name];
  }

  const prefix = `${name}=`;
  const configuredValue = readEnvFile()
    .split(/\r?\n/)
    .find((line) => line.trim().startsWith(prefix));
  return configuredValue?.slice(configuredValue.indexOf('=') + 1).trim();
}

function readMongoUri(): string {
  const configuredValue = readEnvValue('MONGODB_URI');
  if (configuredValue) {
    return configuredValue;
  }

  const contents = readEnvFile();
  if (!contents) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and add the connection string.');
  }

  // Accept a file containing only the URI for compatibility with the
  // connection file created during the classroom exercise.
  const mongoUri = contents;

  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    throw new Error('The MongoDB connection string in .env is invalid.');
  }
  return mongoUri;
}

export async function startServer(): Promise<void> {
  const port = Number(readEnvValue('PORT')) || 3000;
  await mongoose.connect(readMongoUri());
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

if (require.main === module) {
  startServer().catch((error: unknown) => {
    console.error('Error connecting to MongoDB:', error);
    process.exitCode = 1;
  });
}
