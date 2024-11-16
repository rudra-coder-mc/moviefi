import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import validator from "validator"; 
import jwt from "jsonwebtoken";

connect();

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    // Check if email is valid
    if (!email || !validator.isEmail(email)) {
      return NextResponse.json({ error: "Email is invalid." }, { status: 400 });
    }

    // Check password length or other validations
    if (!password || password.length < 6) {
      // Example: password should be at least 6 characters
      return NextResponse.json(
        { error: "Password is invalid" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }



    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const tokenData = {
      id: user._id,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });
    const response = NextResponse.json({
      message: "Login successful",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error: unknown) {
    const e = error as Error;
    
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
};
