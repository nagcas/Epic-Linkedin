import express from 'express';
import Profile from '../models/profile.js';
import { generateJWT } from '../utils/jwt.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import passport from '../config/passportConfig.js';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const router = express.Router();


// Funzione di callback per gestire il successo dell'autenticazione
async function handleAuthCallback(req, res) {
  try {
    const token = await generateJWT({ id: req.user._id });
    res.redirect(`${FRONTEND_URL}/?token=${token}`);
  } catch (error) {
    console.error('Errore nella generazione del token:', error);
    res.redirect(`${FRONTEND_URL}}/?error=auth_failed`);
  }
}

// POST /login => restituisce token di accesso
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const profile = await Profile.findOne({ email });

    if (!profile) {
      return res.status(401).json({ message: 'Credenziali non valide...' });
    }

    const isMatch = await profile.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non trovate...' });
    }

    const token = await generateJWT({ id: profile._id });
    res.json({ token, message: 'Login effettuato con successo' });
  } catch (error) {
    console.error('Errore nel login:', error);
    res.status(500).json({ message: 'Errore nel server' });
  }
});

// GET /me => restituisce il profilo collegato al token di accesso
router.get('/me', authMiddleware, (req, res) => {
  try {
    const profileData = req.profile.toObject();
    delete profileData.password;
    res.json(profileData);
  } catch (error) {
    console.error('Errore nel recupero dell\'autore:', error);
    res.status(500).json({ message: 'Errore nel server' });
  }
});

// Rotte di autenticazione con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/` }),
  handleAuthCallback
);

export default router;
