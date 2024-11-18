import { connect } from "@/dbConfig/dbConfig"; // MongoDB connection
import Movies from "@/Models/movies.model";

import { NextRequest, NextResponse } from "next/server";

connect();

export const GET = async (request: NextRequest) => {
  try {
    // Get pagination parameters from query string using .get() method
    const page = request.nextUrl.searchParams.get("page") || "1";
    const limit = request.nextUrl.searchParams.get("limit") || "8";

    // Convert to numbers
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    // Validate pagination parameters
    if (pageNumber < 1 || limitNumber < 1) {
      return NextResponse.json(
        { error: "Page and limit must be greater than 0" },
        { status: 400 }
      );
    }

    // Calculate the number of documents to skip for pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch the paginated data from the database
    const movies = await Movies.find().skip(skip).limit(limitNumber);

    // Count the total number of movies for pagination info
    const totalMovies = await Movies.countDocuments();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalMovies / limitNumber);

    return NextResponse.json(
      {
        success: true,
        movies,
        pagination: {
          currentPage: pageNumber,
          totalPages,
          totalMovies,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch movies: ${error}` },
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
    const newMovie = new Movies({ title, publishingYear, poster });
    await newMovie.save();

    return NextResponse.json(
      { success: true, message: "Movie created successfully", movie: newMovie },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch movies ${error}` },
      { status: 500 }
    );
  }
};
