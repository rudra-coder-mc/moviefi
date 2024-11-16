import { connect } from "@/dbConfig/dbConfig";
import User from "@/Models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

connect();

export const POST = async (request: NextRequest) => {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    // Check if username is defined
    if (!username) {
      return NextResponse.json(
        { error: "Username is not defined." },
        { status: 400 }
      );
    }

    // Check if email is valid
    if (!email || !validator.isEmail(email)) {
      return NextResponse.json({ error: "Email is invalid." }, { status: 400 });
    }

    // Check password length or other validations
    if (!password || password.length < 6) {
      // Example: password should be at least 6 characters
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername !== null) {
      return NextResponse.json(
        { error: "Username already exists." },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail !== null) {
      return NextResponse.json(
        { error: "Email already exists." },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const tokenData = {
      id: savedUser._id,
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      message: "User created successfully.",
      success: true,
      savedUser,
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
