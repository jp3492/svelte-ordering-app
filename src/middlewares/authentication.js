import User from '../database/models/user_model';
import admin from '../firebase';

const authenticationMiddleware = async (req, res, next) => {

  try {
    const sessionCookie = req.cookies.__session || '';
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    const user = await User.findOne({ firebaseId: decodedClaims.user_id });
    req.user = user._id;
    console.log("REQ:USER", req.user);
    next();
  } catch (error) {
    req.user = null;
    res.redirect('/auth/login');
  }
}

export default authenticationMiddleware;