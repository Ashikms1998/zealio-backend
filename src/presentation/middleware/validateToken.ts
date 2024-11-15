import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Token } from "../../external-libraries/Token";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}
export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let JWT_KEY = process.env.JWT_SECRET as string;
    let AuthService = new Token();
    const accessToken = req.cookies?.accessToken;
    if (accessToken) {
      jwt.verify(accessToken, JWT_KEY, (err: any, data: any) => {
        if (err) {
          return res.status(403).json({
            message: "access to the requested resource is forbidden.",
          });
        } else {
          req.userId = data.userId;
          return next();
        }
      });
    } else {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(401)
          .json({ message: "Refresh token not found, please log in again" });
      }

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string,
        async (err: any, data: any) => {
          if (err) {
            return res
              .status(403)
              .json({ message: "Invalid refresh token, please log in again" });
          }

          const { accessToken } = AuthService.generatingTokens(data.userId);

          res.cookie("accessToken", accessToken, {
            httpOnly: false,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000,
          });
          res.setHeader("Authorization", `Bearer ${accessToken}`);
          req.userId = data.userId;
          return next();
        }
      );
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
