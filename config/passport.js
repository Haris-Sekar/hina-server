import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import bcrypt from "bcryptjs";
import { User } from "../models/index.js";

const configurePassport = () => {
	passport.use(
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
			},
			async (email, password, done) => {
				try {
					const user = await User.findOne({ where: { email } });
					if (!user)
						return done(null, false, { message: "Invalid credentials" });

					const isMatch = await bcrypt.compare(password, user.password);
					if (!isMatch)
						return done(null, false, { message: "Invalid credentials" });

					return done(null, user);
				} catch (err) {
					return done(err);
				}
			}
		)
	);

	passport.use(
		new JwtStrategy(
			{
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: process.env.JWT_SECRET,
			},
			async (jwtPayload, done) => {
				try {
					const user = await User.findByPk(jwtPayload.id);
					if (!user) return done(null, false);
					return done(null, user);
				} catch (err) {
					return done(err, false);
				}
			}
		)
	);

	passport.serializeUser((user, done) => done(null, user.id));
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findByPk(id);
			done(null, user);
		} catch (err) {
			done(err, null);
		}
	});
};

export default configurePassport;
