module.exports = {
  apps: [
    {
      name: "my-nuxt-app",
      script: "npm",
      args: "run preview",
      instances: 1,
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "200M",
    },
  ],
};
