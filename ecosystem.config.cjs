// PM2 Ecosystem Configuration for ContractScan AI
// Usage: pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'contractscan-ai',
      script: 'dist/server.cjs',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // Logging
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Graceful restart
      kill_timeout: 5000,
      listen_timeout: 8000,
    },
  ],
};
