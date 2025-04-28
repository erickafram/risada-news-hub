module.exports = {
  apps: [
    {
      name: "memepmw-api",
      script: "./backend/src/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      },
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "300M"
    }
  ]
};
