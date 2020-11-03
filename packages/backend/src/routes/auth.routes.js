const { verifySignUp, authJwt } = require('../middleware');
const controller = require('../controllers/auth.controller');

module.exports = (app) => {
  app.post(
    '/api/auth/signup',
    [
      authJwt.verifyTokens,
      authJwt.isAdmin,
      verifySignUp.checkUserDuplicateUsernameOrEmail,
    ],
    controller.signup,
  );

  app.post('/api/auth/signin', controller.signin);

  app.post('/api/auth/refreshtoken', controller.refreshToken);

  app.get(
    '/api/auth/moderators',
    [authJwt.verifyTokens, authJwt.isAdmin],
    controller.getModerators,
  );
};
