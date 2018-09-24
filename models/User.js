const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    email: { type: String }
});

// Encrypt user password
UserSchema.pre('save', function(next){
    let user = this;
    bcrypt.hash(user.password, 10, function(err, hash){
        user.password = hash;
        next();
    });
});

// Authenticate user credentials
function authenticate(username, password, callback){
    // User.find({username: req.body.username}, function(err, data){
    //     if(data.length === 0){
    //       req.session.destroy(function(err){
    //         res.render('login', { error: 'User authentication failed. Invalid credentials.' });
    //       });
    //     }else{
    //       req.session.username = data[0].username;
    //       res.redirect('index');
    //     }
    // });
};

const User = mongoose.model('User', UserSchema, 'users');

module.exports = {
    User: User,
    authenticate: authenticate()
}