const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    personalTasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    }],
    workspaces: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace'
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
});

//automatically hash a user's password (pre-save hook, function runs before save())
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
      return next();
    }
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error);
    }
  });