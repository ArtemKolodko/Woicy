module.exports = {
	development: {
		db: 'mongodb://localhost/passport-tut',
		app: {
			name: 'Passport Authentication Tutorial'
		},
		facebook: {
			clientID: "513995372075861",
			clientSecret: "cf085109da760b8cfdc0dffb8ef90f8a",
			callbackURL: "http://localhost:3000/auth/facebook/callback"
		},

		google: {
			clientID: "681465023647-6o1fhpd1c08lf26a54tl84nma3n0pqk4.apps.googleusercontent.com",
			clientSecret: "a_tVkcCh3ZTvyYANiocAVB5w",
			callbackURL: "http://localhost:3000/auth/google/callback"
		},

        vk: {
            clientID: "4736082",
            clientSecret: "9y9obKuYJ9y1PXPjRbxR",
            callbackURL: "http://localhost:3000/auth/vk/callback"
        }
	},
  	production: {
    	db: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL,
		app: {
			name: 'Passport Authentication Tutorial'
		},
		facebook: {
			clientID: "",
			clientSecret: "",
			callbackURL: ""
		},
		google: {
			clientID: '',
			clientSecret: '',
			callbackURL: ''
		}
 	}
}
