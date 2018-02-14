const envBuild = {
  'server': [
    'PORT=3000'
  ],
  'client': [
    'NODE_ENV=DEVELOPMENT',
    'DEBUG=TRUE',
    'ENVPREFIX=REACT_APP_',
    'REST_SERVER_URL=http://localhost:4990',
    'SOCKET_SERVER_URL=http://localhost:4155',

  ]
};

module.exports = envBuild;
