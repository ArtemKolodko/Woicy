var mongoose = require('mongoose')
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
    ,VKontakteStrategy = require('passport-vkontakte').Strategy
    , User = mongoose.model('User');


module.exports = function (passport, config) {

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findOne({ _id: id }, function (err, user) {
			done(err, user);
		});
	});

  	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
    },
    function(email, password, done) {
    	User.isValidUserPassword(email, password, done);
    }));

	passport.use(new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'displayName', 'name', 'profileUrl', 'emails', 'photos']
    },
    function(accessToken, refreshToken, profile, done) {
        console.log("PROFILE FACEBOOK!", profile._json.picture.data.url);
    	profile.authOrigin = 'facebook';

        profile._json.picture = profile._json.picture.data.url;

    	User.findOrCreateOAuthUser(profile, function (err, user) {
	      return done(err, user);
	    });
    }));

	passport.use(new GoogleStrategy({
	    clientID: config.google.clientID,
	    clientSecret: config.google.clientSecret,
	    callbackURL: config.google.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done) {
	  	profile.authOrigin = 'google';
	    User.findOrCreateOAuthUser(profile, function (err, user) {
	      return done(err, user);
	    });
	  }
	));

    passport.use(new VKontakteStrategy({
            clientID:     config.vk.clientID,
            clientSecret: config.vk.clientSecret,
            callbackURL:  config.vk.callbackURL
        },

        function(accessToken, refreshToken, params, profile, done) {

            // записываем email, полученный в accessToken, а профиль пользователя
            profile.email = params.email;

            profile.authOrigin = 'vk';
            User.findOrCreateOAuthUser(profile, function (err, user) {
                return done(err, user);
            });
        }
    ));
}
