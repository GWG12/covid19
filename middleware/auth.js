import jwt from 'jsonwebtoken';


export const authMiddleware = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    return next(error);
  }
  const token = authHeader.split(' ')[1];
  let decodedAccessToken;
  console.log('el access token ', token);
  try {
    decodedAccessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    if (err.message = 'jwt expired') {
      console.log('expires')
      const error = new Error('Unauthorized');
      error.statusCode = 403;
      return next(error);
    }
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    return next(error);
  }
  if (!decodedAccessToken) {
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    return next(error);
  }
  // Check whether refreshToken in cookie is still valid and whether userId from refreshToken in cookie equals userId from incoming accessToken
  if (!req.headers.cookie || !req.headers.cookie.split('=')[1]) {
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    return next(error);
  }
  let decodedRefreshToken;
  console.log('el tojen de refresh ', req.headers.cookie.split('=')[1])
  try {
    decodedRefreshToken = jwt.verify(req.headers.cookie.split('=')[1], process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    console.log('previo a ')
    console.log(error)
    error.statusCode = 500;
    return next(error);
  }
  if (decodedAccessToken.id !== decodedRefreshToken.id) {
    console.log('unequal')
    const error = new Error('Unauthorized');
    error.statusCode = 401;
    return next(error);
  }
  return next()


}
