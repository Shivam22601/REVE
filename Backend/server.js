require('dotenv').config({ quiet: true });
const http = require('http');
const cluster = require('cluster');
const os = require('os');
const mongoose = require('mongoose');
const app = require('./app');
const connectDb = require('./config/db');

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const ENABLE_CLUSTER = String(process.env.CLUSTER || '').toLowerCase() === 'true';
const WORKERS = parseInt(process.env.WORKERS || `${os.cpus().length}`, 10);

const startServer = async () => {
  try {
    await connectDb();

    const server = http.createServer(app);

    server.keepAliveTimeout = parseInt(process.env.KEEP_ALIVE_TIMEOUT || '65000', 10);
    server.headersTimeout = parseInt(process.env.HEADERS_TIMEOUT || '180000', 10);
    server.requestTimeout = parseInt(process.env.REQUEST_TIMEOUT || '120000', 10);

    // Gracefully handle server errors (e.g., EADDRINUSE)
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`⚠️ Port ${PORT} is already in use. Kill the process using it or set a different PORT in .env.`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });

    server.listen(PORT, HOST, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
    });

    const shutdown = async (signal) => {
      console.log(`Received ${signal}, shutting down gracefully...`);
      try {
        await new Promise((resolve) => server.close(resolve));
        await mongoose.connection.close(false);
        process.exit(0);
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (ENABLE_CLUSTER && cluster.isPrimary) {
  console.log(`Starting cluster with ${WORKERS} workers`);
  for (let i = 0; i < WORKERS; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.warn(`Worker ${worker.process.pid} died (${signal || code}). Spawning a new one.`);
    cluster.fork();
  });
} else {
  startServer();
}
