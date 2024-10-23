import { User } from "../entities/User";
import { IUserAuth } from "../interfaces/IUserAuth";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IBcrypt } from "../interfaces/IBcrypt";
import { IMailer } from "../interfaces/IMailer";
import { v4 as uuidv4 } from "uuid";
import emailTemplate from "../presentation/utils/emailTemplate";
import { IToken } from "../interfaces/IToken";
import { Admin } from "../entities/Admin";
import { ITodo } from "../interfaces/ITodo";
import { error } from "console";

export class authService implements IUserAuth {
  private repository: IUserRepository;
  private bcrypt: IBcrypt;
  private mailer: IMailer;
  private token: IToken;

  constructor(
    repository: IUserRepository,
    bcrypt: IBcrypt,
    mailer: IMailer,
    token: IToken
  ) {
    this.repository = repository;
    this.bcrypt = bcrypt;
    this.mailer = mailer;
    this.token = token;
  }

  findUserByEmail(email: string): Promise<User | null> {
    const user = this.repository.findByEmail(email);
    return user;
  }

  // async resetPassword(email:string): Promise<User | null> {
  //     const token = uuidv4()
  //     const verify_token = token;
  //     const data = await this.repository.changePassword(verify_token,email);
  //     console.log(data,"resetting data");
  //     if (!data) {
  //         throw new Error("User not found");
  //       }
  //     const html = emailTemplate(data.firstName,data.lastName,data.email,token);
  //     this.mailer.SendEmail(data.email,html)
  //     return data
  // }

  async registerUser(input: User, type?: string) {
    if (input.password) {
      const hashedPassword = await this.bcrypt.Encrypt(input.password);
      input.password = hashedPassword;
    }
    const token = uuidv4();
    input.verify_token = token;
    const data = await this.repository.create(input);
    console.log(data, "Us data");
    if (type) {
      return data;
    } else {
      const email = data.email;
      const html = emailTemplate(
        data.firstName,
        data.lastName ?? "",
        email,
        token
      );
      this.mailer.SendEmail(email, html);
      return data;
    }
  }

  async verifyUser(email: string, token: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (user) {
      console.log(user, user.verify_token, token, "All the cup cap");

      if (user.verify_token === token) {
        const data = {
          verified: true,
        };
        console.log(data, user.id, "updtae nu munp yaya");

        const update = await this.repository.update(user.id, data);
        console.log(update, "yaya");
        if (update) {
          return update;
        }
      }
    }
    return null;
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }
    if (user.password && user.verified) {
      const isPasswordCorrect = await this.bcrypt.compare(
        password,
        user.password
      );

      if (isPasswordCorrect) {
        console.log(user,"zustand data item to be")
        return user;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  generateToken(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
   
    return this.token.generatingTokens(userId);
  }
  async otpUpdate(email: string, verify_token: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }
    const update = await this.repository.otpupdate(email, verify_token);
    console.log(update, "US item 4 10");
    return update;
  }
  async checkingOtp(email: string, verify_token: string): Promise<boolean> {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        return false;
      }

      let checkOtp = await this.repository.otpCheck(email, verify_token);
      console.log(checkOtp, "OTP checked");

      return !!checkOtp;
    } catch (error) {
      console.error("Error during OTP checking:", error);
      return false;
    }
  }
  async changePassword(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }

    const hashedPassword = await this.bcrypt.Encrypt(password);
    let changeingPasscode = await this.repository.changePasscode(
      user.id,
      hashedPassword
    );
    console.log(changeingPasscode, "OTP checked");

    if (changeingPasscode) {
      return changeingPasscode;
    } else {
      console.error("changeingPasscode  failed");
      return null;
    }
  }

  async adminLogin(email: string, password: string): Promise<Admin | null> {
    try {
      const admin = await this.repository.findAdminByEmail(email);

      if (!admin) {
        return null;
      }
      if (admin.password === password) {
        return admin;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      return null;
    }
  }

  async allUsers(): Promise<User[] | null> {
    const newuser = await this.repository.findUsers();
    return newuser;
  }

  async searchedUsers(searchTerm: string): Promise<User[] | null> {
    const reqestedUsers = await this.repository.searchedUsers(searchTerm);
    return reqestedUsers;
  }

  async checkBlocked(userId: string, isBlocked: boolean): Promise<User | null> {
    try {
      console.log(userId, isBlocked, "checkBlocked");
      const updatedUser = await this.repository.isBlocked(userId, isBlocked);
      console.log(updatedUser, "checkBlockedupdatedUser");
      return updatedUser;
    } catch (error) {
      console.error("Error in service while toggling block status:", error);
      return null;
    }
  }

  async todoUpdate(userId: string, task: string): Promise<ITodo | null> {
    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        return null;
      }
      const existingTask = await this.repository.findOne(userId, task);
      if (existingTask) {
        throw new Error('Duplicate Task')
      }
      const userTask = await this.repository.updateTodo(userId, task);
      return userTask;
    } catch (error:any) {
        if(error.message === "Duplicate Task"){
            throw { status: 409, message: 'Task already exists' };
        }

      console.error("Error during updating todo:", error);
      throw error;
    }
  }

  async todoList(userId: string): Promise<ITodo[] | null> {
    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        return null;
      }
      const todoList = await this.repository.fetchTodo(userId);
      return todoList;
    } catch (error) {
      console.error("Error fetching todoList:", error);
      throw error;
    }
  }

  async deletingTask(TaskId: string, userId: string): Promise<ITodo | null> {
    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        return null;
      }
      const deleteTask = await this.repository.updateTaskList(userId, TaskId);
      if (!deleteTask) {
        return null;
      }

      return deleteTask;
    } catch (error) {
      console.error("Error during deleting task:", error);
      throw error;
    }
  }

  async strikeTask(TaskId: string, userId: string): Promise<ITodo | null> {
    try {
      const user = await this.repository.findById(userId);
      if (!user) {
        return null;
      }
      const strikedTask = await this.repository.updateTaskCompleation(
        userId,
        TaskId
      );
      if (!strikedTask) {
        return null;
      }

      return strikedTask;
    } catch (error) {
      console.error("Error during deleting task:", error);
      throw error;
    }
  }

  async findUserById(userId:string): Promise<User | null> {
    const user = await this.repository.findById(userId)
    return user;
  }


}
