import { Request, Response, NextFunction } from "express";
import { IUserAuth } from "../../interfaces/IUserAuth";
import { error } from "console";
import { SendMail } from "../../external-libraries/NodeMailer";

export class authController {
  private authService: IUserAuth;
  
  constructor(authService: IUserAuth) {
    this.authService = authService;
  }

  async userRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;
      const existingUser = await this.authService.findUserByEmail(body.email);

      if (existingUser) {
        if (!existingUser.verified) {
          return res
            .status(409)
            .json({
              error: "Verification Link Already Send to The Given Mail",
            });
        }
        return res
          .status(409)
          .json({ error: "User Already exits with given email " });
      }
      const data = await this.authService.registerUser(body);

      return res.json(data);
    } catch (error) {
      console.error("Error during user registration:", error);
      return res
        .status(500)
        .json({ error: "An unexpected error occurred in user registration." });
    }
  }
  async userVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.query.token as string;
      const email = req.query.email as string;
      console.log("user verification", email, token);

      let result;
      if (token && email) {
        result = await this.authService.verifyUser(email, token);
        console.log("user thenga verified", result);
      }
      if (result) {
        console.log(
          "redirected to ",
          `${process.env.CLIENT_URL}/verify-email?token=${token}`
        );

        res.redirect(`${process.env.CLIENT_URL}/verify-email?token=${token}`);
      } else {
        const error = "Invalid token";
        res.redirect(`${process.env.CLIENT_URL}/verify-email?error=${error}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async onLoginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      console.log(email, password, "EP");
      const user = await this.authService.loginUser(email, password);
      if (user?.id) {
        const { accessToken, refreshToken } = this.authService.generateToken(
          user.id
        );
        
        if (accessToken && refreshToken) {
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
          });
          return res
            .status(200)
            .json({ message: "Sign-in successful", accessToken });
        } else {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      } else {
        return res.status(401).json({ error: "Invalid Credentials" });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async ForgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const {email} = req.body;
      const user = await this.authService.findUserByEmail(email);
      if (user) {
        const generateRandomString = (): string => {
          return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
        };
        const verify_token = generateRandomString();
        console.log("Generated OTP is ", verify_token);
  
        const mailer = await SendMail.sendmail(user.email, verify_token);
        const otpUpdate = await this.authService.otpUpdate(email, verify_token);
        console.log(otpUpdate, "kasfjsd");
  
        return res.status(200).json({ message: "Email Exist" });
      } else {
          return res.status(404).json({ message: "email does not exist" });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async passwordReset(req: Request, res: Response, next: NextFunction) {
    try {
        const body = req.body;
        console.log(body, "body exist");

        const verified = await this.authService.checkingOtp(body.email, body.verify_token);
        console.log(verified, "kasfjsd");

        if (verified) {
            return res.status(200).json({success: true, message: "Email and OTP verification successfull" });
        } else {
            return res.status(400).json({success: false, message: "Incorrect OTP" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "An error occurred during OTP verification" });
    }
}

async passwordChanging(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    console.log({ email, password }, "password exist");

    const changingPass = await this.authService.changePassword(email, password);
    console.log(changingPass, "kasfjsd");

    if (changingPass) {
      return res.status(200).json({ message: "Password changed successfully" });
    } else {
      return res.status(400).json({ message: "Password change failed" });
    }
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: "An error occurred while changing password", 
    errorDetails: error instanceof Error ? error.message : String(error)});
  }
}


async adminLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    console.log(email, password, "admin Em and pass");

    const admin = await this.authService.adminLogin(email, password);
    if (admin) {
      return res.status(200).json({ message: "Admin Sign-in successful" });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    return res.status(500).json({ message: "An error occurred during sign-in",
    errorDetails: error instanceof Error ? error.message : String(error)});
  }
}

async userList(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await this.authService.allUsers();
    res.status(200).json({ message: "Users retrieved successfully", data: response });
  } catch (error) {
      res.status(500).json({ message: "An error occurred while retrieving users",
        errorDetails: error instanceof Error ? error.message : String(error)});
  }

}

async userQuery(req: Request, res: Response, next: NextFunction){
  try {
    const searchTerm = req.query.q as string;
    console.log(searchTerm,"searchTerm");
    const response = await this.authService.searchedUsers(searchTerm);
    res.status(200).json({ message: "Users retrieved successfully", data: response });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while retrieving searched users",
      errorDetails: error instanceof Error ? error.message : String(error)});

  }
}

async otpResend(req:Request,res:Response,next:NextFunction){
  try {
    const {email} = req.body;
    const user = await this.authService.findUserByEmail(email);
    if (user) {
      const generateRandomString = (): string => {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
      };
      const verify_token = generateRandomString();
      console.log("Generated OTP is ", verify_token);

      const mailer = await SendMail.sendmail(user.email, verify_token);
      const otpUpdate = await this.authService.otpUpdate(email, verify_token);
      console.log(otpUpdate, "kasfjsd");

      return res.status(200).json({ message: "Email Exist" });
    } else {
        return res.status(404).json({ message: "email does not exist" });
    }
  } catch (error) {
    console.log(error);
  }
}


async authCallbackController(req:Request,res:Response,next:NextFunction)
{
  try {
    const user = req.user as any

    if (!user) {
      return res.status(401).json({message: "Authentication failed"})
    }
    
    const {accessToken, refreshToken} = this.authService.generateToken(
      user.id
    )

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge:15 * 60 * 1000,
    })
    return res.redirect(`${process.env.CLIENT_URL}/home`);
  } catch (error) {
    next(error)
  }
}

async checkBlocked(req:Request,res:Response,next:NextFunction){
  try {
    const { userId, isBlocked } = req.body;
    console.log(userId,isBlocked,"user id send from front for blocking");
    const updatedUser = await this.authService.checkBlocked(userId,isBlocked)
    if (updatedUser) {
      return res.status(200).json({
        message: `User ${updatedUser.isBlocked ? 'blocked' : 'unblocked'} successfully`,
        data: updatedUser
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error during blocking/unblocking user:', error);
    return res.status(500).json({ error: 'An error occurred while blocking/unblocking the user.' });
  
  }
}

async addTask(req:Request,res:Response,next:NextFunction){
  try {
    const {task,userId} = req.body;
    const todoUpdate = await this.authService.todoUpdate(userId,task)
    if (todoUpdate) {
      res.status(201).json(todoUpdate);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error during adding todo task:', error);
    return res.status(500).json({ error: 'An error occurred while adding todo task.' });
  }
}

async fetchingTasks(req:Request,res:Response,next:NextFunction){
  try {
    const userId = req.query.userId
    const todoList = await this.authService.todoList(userId as string)
    if (todoList) {
      res.status(201).json(todoList);
    } else {
      res.status(404).json({ error: 'todoList not found' });
    }
  } catch (error) {
    console.error('Error during fetching todoList:', error);
    return res.status(500).json({ error: 'An error occurred during fetching todoList.' });
  }
}

async deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    const TaskId = req.query._id as string;
    const userId = req.query.userId as string;

    if (!TaskId || !userId) {
      return res.status(400).json({ message: "Task ID or User ID is missing" });
    }

    const deletedTask = await this.authService.deletingTask(TaskId, userId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found or unauthorized action" });
    }

    res.status(200).json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    console.log('Error during deleting task', error);
    res.status(500).json({ message: "Error deleting task" });
  }
}

async updateTaskCompleation(req: Request, res: Response, next: NextFunction) {
  try {
    const TaskId = req.query._id as string;
    const userId = req.query.userId as string;

    if (!TaskId || !userId) {
      return res.status(400).json({ message: "Task ID or User ID is missing" });
    }

    const taskStriked = await this.authService.strikeTask(TaskId, userId);

    if (!taskStriked) {
      return res.status(404).json({ message: "Task not found or unauthorized action" });
    }

    res.status(200).json({ message: "Task deleted successfully", taskStriked });
  } catch (error) {
    console.log('Error during striking task', error);
    res.status(500).json({ message: "Error striking task" });
  }

}

}
