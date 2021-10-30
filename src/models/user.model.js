const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 8,
      },
      password: {
        type: String,
        required: true,
        trim: true,
      },
    },
    {
      timestamps: true,
    },
);

// Hash the password before saving it in the database
userSchema.pre('save', function(next) {
  const user = this;
  // generate a salt
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    // hash the password using new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Check if password matches the user's password
 * @param {string} password
 * @return {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async (password) => {
  const user = this;
  return bcrypt.compare(password, user.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
