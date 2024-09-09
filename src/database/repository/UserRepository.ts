import { User } from "../../entities/User";
import { IUserRepository } from "../../interfaces/IUserRepository";
import { User as UserModel } from "../models/UserSchema";
import { Admin as AdminModel } from "../models/AdminSchema";
import { ForgotSchema as ForgotPassword } from "../models/ForgotPassSchema";
import { Admin } from "../../entities/Admin";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      const userData: User = {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName ?? "",
        email: user.email,
        password: user.password ?? "",
        verify_token: user.verify_token ?? "",
        verified: user.verified,
        isBlocked:user.isBlocked ?? false
      };

      return userData;
    }
    return null;
  }

  async create(data: User): Promise<User> {
    const newUserData = await UserModel.create(data);
    const newUser: User = {
      id: newUserData._id.toString(),
      firstName: newUserData.firstName,
      lastName: newUserData.lastName ?? "",
      email: newUserData.email,
      password: newUserData.password ?? "",
      verify_token: newUserData.verify_token ?? "",
      verified: newUserData.verified,
      isBlocked:newUserData.isBlocked ?? false
    };
    return newUser;
  }

  async update(id: string, data: any): Promise<User | null> {
    console.log(id, data, "UPDATE IL KERI VRO");
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { new: true }
    );
    console.log(updatedUser, "updatedUser IL KERI VRO");

    if (updatedUser) {
      return {
        id: updatedUser._id.toString(),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName ?? "",
        email: updatedUser.email,
        password: updatedUser.password ?? "",
        verify_token: updatedUser.verify_token ?? "",
        verified: updatedUser.verified,
        isBlocked:updatedUser.isBlocked ?? false
      };
    }
    return null;
  }
  // async changePassword(email:string,verify_token:string): Promise<User | null> {

  //         const newUserData = await ForgotPassword.create({email,verify_token})
  //         const userData: ForgotPasswordEntity = {
  //                 email:newUserData.email,
  //                 verify_token:newUserData.verify_token
  //             }
  //             return userData
  //         }

  async otpupdate(email: string, verify_token: string): Promise<User | null> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: email },
      { $set: { verify_token } },
      { new: true }
    );

    if (updatedUser) {
      return {
        id: updatedUser._id.toString(),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName ?? "",
        email: updatedUser.email,
        password: updatedUser.password ?? "",
        verify_token: updatedUser.verify_token ?? "",
        verified: updatedUser.verified,
        isBlocked:updatedUser.isBlocked ?? false
      };
    }
    return null;
  }

  async otpCheck(email: string, verify_token: string): Promise<User | null> {
    const userDoc = await UserModel.findOne({ email: email });
    if (userDoc && verify_token === userDoc.verify_token) {
      const userData: User = {
        id: userDoc._id.toString(),
        firstName: userDoc.firstName,
        lastName: userDoc.lastName ?? "",
        email: userDoc.email,
        password: userDoc.password ?? "",
        verify_token: userDoc.verify_token,
        verified: userDoc.verified,
        isBlocked:userDoc.isBlocked ?? false
      };
      return userData;
    }
    return null;
  }

  async changePasscode(
    id: string,
    hashedPassword: string
  ): Promise<User | null> {
    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: id },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (updatedUser) {
      return {
        id: updatedUser._id.toString(),
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName ?? "",
        email: updatedUser.email,
        password: updatedUser.password ?? "",
        verify_token: updatedUser.verify_token ?? "",
        verified: updatedUser.verified,
        isBlocked:updatedUser.isBlocked ?? false
      };
    }
    return null;
  }

  async findAdminByEmail(email: string): Promise<Admin | null> {
    const admin = await AdminModel.findOne({ email: email });
    if (admin) {
      const adminData: Admin = {
        id: admin._id.toString(),
        email: admin.email,
        password: admin.password,
      };

      return adminData;
    }
    return null;
  }
  async findUsers(): Promise<User[] | null> {
    try {
      const documents = await UserModel.find();

      const users = documents.map((doc) => {
        return {
          id: doc._id.toString(),
          firstName: doc.firstName,
          lastName: doc.lastName ?? "",
          email: doc.email,
          password: doc.password ?? "",
          verify_token: doc.verify_token ?? "",
          verified: doc.verified,
          isBlocked:doc.isBlocked ?? false
        };
      });

      return users.length > 0 ? users : null;
    } catch (error) {
      console.error("Error during finding all users:", error);
      return null;
    }
  }


  async searchedUsers(searchTerm?:string): Promise<User[] | null>{
    try {
      const documents = await UserModel.find({
        $or: [
          { firstName: { $regex: searchTerm, $options: "i" } },
          { lastName: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } }
        ]
      });

      const users = documents.map((doc) => {
        return {
          id: doc._id.toString(),
          firstName: doc.firstName,
          lastName: doc.lastName ?? "",
          email: doc.email,
          password: doc.password ?? "",
          verify_token: doc.verify_token ?? "",
          verified: doc.verified,
          isBlocked:doc.isBlocked ?? false
          
        };
      });
      return users
    } catch (error) {
      console.error("Error during finding requested users:", error);
      return null;
    }
  }

  async createOrUpdateGoogleUser(profile: any): Promise<any> {
    try {
    console.log("got the profile :", profile, "Stopped here");
    const existingUser = await UserModel.findOne({ googleId: profile.id });
    console.log(existingUser, "eX");
    if (existingUser) {
      return existingUser;
    } else {
      const userByEmail = await UserModel.findOne({
        email: profile.emails[0].value,
      });
      console.log(userByEmail, "userByEmail");
      if (userByEmail) {
        userByEmail.googleId = profile.id;
        await userByEmail.save();
        return userByEmail;
      } else {
        const newUser = new UserModel({
          firstName: profile.displayName.split(" ")[0],
          lastName: profile.displayName.split(" ").slice(1).join(" ") || "",
          email: profile.emails[0].value,
          googleId: profile.id,
          verified: true,
        });
        console.log(newUser, "newUser");
        await newUser.save();
        return newUser;
      }
    }
  } catch (error) {
    console.error("the error with db : ", error);
  }
  }

  async isBlocked(userId:string,isBlocked:boolean): Promise<User | null>{
    try {
      const doc = await UserModel.findById(userId)
      if (!doc) {
        return null;
      }

      const user: User = {
        id: doc._id.toString(),
        firstName: doc.firstName,
        lastName: doc.lastName ?? "",
        email: doc.email,
        password: doc.password ?? "",
        verify_token: doc.verify_token ?? "",
        verified: doc.verified,
        isBlocked:isBlocked
      };
  
      return user;
    } catch (error) {
      console.error("Error during blocking/unblocking user:", error);
      return null;
    }
  }
  
}
