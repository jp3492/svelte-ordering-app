import admin from '../../firebase';

export const post = async (req, res) => {

  try {
    const idToken = req.body.idToken.toString();
    const csrfToken = req.body.csrfToken.toString();

    // Guard against CSRF attacks.
    if (csrfToken !== "someCsrfToken") {
      res.status(401).send('UNAUTHORIZED REQUEST!');
      return;
    }

    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn })

    const options = { maxAge: expiresIn, httpOnly: true, secure: process.env.NODE_ENV === "development" ? false : true };
    res.cookie('__session', sessionCookie, options);
    res.end(JSON.stringify({ status: 'success' }));

  } catch (error) {
    console.log(error);
    res.status(404).send({ error });
  }
}