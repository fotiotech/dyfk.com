// models/User.ts
import mongoose, { Document, Model, ObjectId } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
  role: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  status: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving the user model
UserSchema.pre<IUser>("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
