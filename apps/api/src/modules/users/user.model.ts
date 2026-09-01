import bcrypt from "bcryptjs";
import { Model, Schema, model } from "mongoose";
import { IUser } from "./user.types";

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = Model<IUser, object, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
   name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 }, 
   
   email: { type: String, required: true, unique: true, lowercase: true, trim: true }, 
   
   password: { type: String, required: true, select: false, minlength: 8 }
  },
  {
    timestamps: true,
  });

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const saltRounds = 12;

  this.password = await bcrypt.hash(
    this.password,
    saltRounds
  );
});

userSchema.method( "comparePassword", async function ( candidatePassword: string ): Promise<boolean> {
    return bcrypt.compare(
      candidatePassword,
      this.password
    );
  }
);

export const User = model<IUser, UserModel>("User", userSchema);
