var mongoose = require('mongoose');
var hash = require('../util/hash');

UserSchema = mongoose.Schema({
	firstName:  String,
	lastName:   String,
	email:      String,
    photo:      String,
	salt:       String,
	hash:       String,
	facebook:{
		id:       String,
		email:    String,
		name:     String,
        photo:    String
	},
	google:{
		id:       String,
		email:    String,
		name:     String,
        photo:    String
	},
    vk: {
        id:       String,
        email:    String,
        name:     String,
        photo:    String
    }
});

UserSchema.statics.signup = function(email, password, done){
	var User = this;
	hash(password, function(err, salt, hash){
		if(err) throw err;
		// if (err) return done(err);
		User.create({
			email : email,
			salt : salt,
			hash : hash
		}, function(err, user){
			if(err) throw err;
			// if (err) return done(err);
			done(null, user);
		});
	});
}


UserSchema.statics.isValidUserPassword = function(email, password, done) {
	this.findOne({email : email}, function(err, user){
		// if(err) throw err;
		if(err) return done(err);
		if(!user) return done(null, false, { message : 'Incorrect email.' });
		hash(password, user.salt, function(err, hash){
			if(err) return done(err);
			if(hash == user.hash) return done(null, user);
			done(null, false, {
				message : 'Incorrect password'
			});
		});
	});
};

// Create a new user given a profile
UserSchema.statics.findOrCreateOAuthUser = function(profile, done){
	var User = this;

	// Build dynamic key query
	var query = {};
	query[profile.authOrigin + '.id'] = profile.id;

	// Search for a profile from the given auth origin
	User.findOne(query, function(err, user){
		if(err) throw err;

        //console.log("PROFILE!", profile._json);

		// If a user is returned, load the given user
		if(user){
			done(null, user);
		} else if(profile.authOrigin == 'google' || profile.authOrigin == 'facebook') {

			// Otherwise, store user, or update information for same e-mail
			User.findOne({ 'email' : profile.emails[0].value }, function(err, user){
				if(err) throw err;

				if(user){
					// Preexistent e-mail, update
					user[''+profile.authOrigin] = {};
					user[''+profile.authOrigin].id = profile.id;
					user[''+profile.authOrigin].email = profile.emails[0].value;
					user[''+profile.authOrigin].name = profile.displayName;
                    user[''+profile.authOrigin].photo = profile._json.picture;

					user.save(function(err, user){
						if(err) throw err;
						done(null, user);
					});
				} else {
					// New e-mail, create
					
					// Fixed fields
					user = {
						email : profile.emails[0].value,
						firstName : profile.displayName.split(" ")[0],
						lastName : profile.displayName.replace(profile.displayName.split(" ")[0] + " ", ""),
                        photo: profile._json.picture
					};

					// Dynamic fields
					user[''+profile.authOrigin] = {};
					user[''+profile.authOrigin].id = profile.id;
					user[''+profile.authOrigin].email = profile.emails[0].value;
					user[''+profile.authOrigin].name = profile.displayName;
                    user[''+profile.authOrigin].photo = profile._json.picture;

					User.create(
						user,
						function(err, user){
							if(err) throw err;
							done(null, user);
						}
					);
				}
			});
		} else if(profile.authOrigin == 'vk') {

            user = {
                email : profile.email,
                firstName : profile.name.givenName,
                lastName : profile.name.familyName,
                photo: profile._json.photo
            };

            user[''+profile.authOrigin] = {};
            user[''+profile.authOrigin].id = profile.id;
            user[''+profile.authOrigin].email = profile.email;
            user[''+profile.authOrigin].name = profile.displayName;
            user[''+profile.authOrigin].photo = profile._json.photo;


            User.create(
                user,
                function(err, user){
                    console.log("user created", user);
                    if(err) throw err;
                    done(null, user);
                }
            );
        }
	});
}

var User = mongoose.model("User", UserSchema);
module.exports = User;