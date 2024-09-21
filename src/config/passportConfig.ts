import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
dotenv.config();
import { UserRepository } from '../database/repository/UserRepository';
import { User } from '../database/models/UserSchema';
const url = process.env.SERVER_URL;
const {createOrUpdateGoogleUser} =
  new UserRepository()
passport.use(
  new GoogleStrategy(
    {
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: `${url}/auth/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await createOrUpdateGoogleUser(profile)
    done(null, user)
  } catch (error) {
    done(null, false);

  }

}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
