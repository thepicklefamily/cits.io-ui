const envBuild = {
  'server': [
    'PORT=3000'
  ],
  'client': [
    'NODE_ENV=DEVELOPMENT',
    'DEBUG=TRUE',
    'REST_SERVER_URL=http://localhost:4990',
    'SOCKET_SERVER_URL=http://localhost:4155',
    'SMTP_SERVER_LOCAL_HOST=http://localhost:8080'
  ]
};

module.exports = envBuild;
