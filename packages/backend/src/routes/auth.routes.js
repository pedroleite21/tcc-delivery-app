const { verifySignUp, authJwt } = require('../middleware');
const controller = require('../controllers/auth.controller');

module.exports = (app) => {
  app.use((_, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );

    next();
  });

  app.post(
    '/api/auth/signup',
    [
      authJwt.verifyTokens,
      authJwt.isAdmin,
      verifySignUp.checkDuplicateUsernameOrEmail,
    ],
    controller.signup,
  );

  app.post('/api/auth/signin', controller.signin);

  app.post('/api/auth/refreshtoken', controller.refreshToken);
};
