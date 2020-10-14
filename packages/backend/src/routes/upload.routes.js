const { authJwt } = require('../middleware');
const controller = require('../controllers/upload.controller');

module.exports = (app) => {
  app.post(
    '/api/upload',
    [authJwt.verifyTokens, authJwt.isAdmin],
    controller.singleUpload,
  );
};
