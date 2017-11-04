const ErrorHelper = require('../helpers/ErrorHelper');
const HeadersHelper = require('../helpers/headers');
const Token = require('../models/Token');

module.exports = function (req, res, next) {
  console.log('Middleware session');
  console.log(`${new Date()}: 
  Called on ${req.url} 
  with method ${req.method}`);

  HeadersHelper.getToken(req).then(token => {
     console.log('got token', token);
     return Token.findOne({token});
  })
/*
  const auth = req.header('Authorization');
  console.log(`Auth ${auth}`);

  if(!auth || auth === undefined){
      const err = ErrorHelper.format('No has iniciado sesión', 403,1001);
      ErrorHelper.catchError(res, err);
      return;
  }

  const [_nameAuth, token] = auth.split(' ');
  const [nameAuth] = _nameAuth.split(':');
  if(nameAuth !== 'Bearer'){
      const err = ErrorHelper.format(`Autorización ${nameAuth} no válido`, 400, 1001);
      ErrorHelper.catchError(res, err);
      return;
  }

  console.log(`Token: ${token}`);

    if (token === null || token === undefined || token === 'null') {
        const err = ErrorHelper.format('No has iniciado sesión', 403, 1001);
        ErrorHelper.catchError(res, err);
        return;
    }
*/

        .then(tokenFound => {
            console.log('token found ?', tokenFound);
            if(!tokenFound){
                const err = ErrorHelper.format('Tu token no se ha encontrado', 404, 1001);
                ErrorHelper.catchError(res, err);
                return;
            }

            if(!tokenFound.isValid){
                const err = ErrorHelper.format('Tu token ha expirado', 403, 1001);
                ErrorHelper.catchError(res, err);
                return;
            }

            next();
        })
        .catch(err => {
            console.log('Error getting token');
            ErrorHelper.catchError(res, err);
        });
};