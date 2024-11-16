import { connect } from "@/dbConfig/dbConfig"; // MongoDB connection
import Movie from "@/models/movieModel"; // Movie model
import { NextRequest, NextResponse } from "next/server";

connect();

export const GET = async () => {
  try {
    const movies = await Movie.find();
    return NextResponse.json({ success: true, movies }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const { title, publishingYear, poster } = await request.json();

    // Simple validation
    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    if (
      !publishingYear ||
      typeof publishingYear !== "number" ||
      publishingYear < 1800 ||
      publishingYear > new Date().getFullYear()
    ) {
      return NextResponse.json(
        { error: "Invalid publishing year" },
        { status: 400 }
      );
    }

    if (!poster || typeof poster !== "string" || !poster.startsWith("http")) {
      return NextResponse.json(
        { error: "Poster must be a valid URL" },
        { status: 400 }
      );
    }

    // Save to database
    const newMovie = new Movie({ title, publishingYear, poster });
    await newMovie.save();

    return NextResponse.json(
      { success: true, message: "Movie created successfully", movie: newMovie },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create movie" },
      { status: 500 }
    );
  }
};
