import { connect } from "@/dbConfig/dbConfig";
import Movie from "@/models/movieModel";
import { NextRequest, NextResponse } from "next/server";

connect();

// GET: Get a movie by ID
export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params; // Extract movie ID from the URL
  try {
    const movie = await Movie.findById(id);

    if (!movie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, movie }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch movie" },
      { status: 500 }
    );
  }
};

// PATCH: Update a movie
export const PATCH = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params; // Extract movie ID from the URL
  try {
    const { title, publishingYear, poster } = await request.json();

    // Basic validation for updated fields
    if (title && (typeof title !== "string" || title.trim() === "")) {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }

    if (
      publishingYear &&
      (typeof publishingYear !== "number" ||
        publishingYear < 1800 ||
        publishingYear > new Date().getFullYear())
    ) {
      return NextResponse.json(
        { error: "Invalid publishing year" },
        { status: 400 }
      );
    }

    if (poster && (typeof poster !== "string" || !poster.startsWith("http"))) {
      return NextResponse.json(
        { error: "Poster must be a valid URL" },
        { status: 400 }
      );
    }

    // Update the movie
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { title, publishingYear, poster },
      { new: true } // Return the updated document
    );

    if (!updatedMovie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Movie updated successfully",
        movie: updatedMovie,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update movie" },
      { status: 500 }
    );
  }
};

// DELETE: Remove a movie
export const DELETE = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params; // Extract movie ID from the URL
  try {
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return NextResponse.json({ error: "Movie not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Movie deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete movie" },
      { status: 500 }
    );
  }
};
