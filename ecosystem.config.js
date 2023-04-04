module.exports = {
  apps: [
    {
      name: 'game-price-alert',
      script: 'dist/main.js',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
