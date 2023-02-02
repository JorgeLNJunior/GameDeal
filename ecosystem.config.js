module.exports = {
  apps: [
    {
      name: 'game-price-alert',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      instance_var: 'INSTANCE_ID',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
