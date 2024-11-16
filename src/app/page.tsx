"use client";
import Button from "@/components/Button";
import MovieCard from "@/components/MovieCard";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Movie {
  _id: string;
  title: string;
  publishingYear: number;
  poster: string;
}

/**
 * Home component that displays a list of movies and provides functionalities
 * to add a new movie, edit existing movies, and log out.
 *
 * The component fetches movies from the server on mount and displays them
 * in a grid layout. Users can navigate to the add movie page, edit existing
 * movies, or log out using the provided actions.
 *
 * If there are no movies to display, a message is shown with an option to
 * add a new movie.
 *
 * @returns {JSX.Element} The Home component UI.
 */
export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const page = false;

  const router = useRouter();

  /**
   * Fetch movies from the server.
   *
   * This function sends a GET request to the server to fetch the list of
   * movies. It sets the movies state to the received list of movies.
   *
   * If the request fails, it logs the error to the console.
   *
   * Finally, it sets the loading state to false.
   */
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/movies");
      setMovies(response.data.movies);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigate to the add movie page.
   *
   * @returns {void}
   */
  const onAdd = () => {
    router.push("/add");
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  /**
   * Logs the user out by calling the `/api/logout` endpoint.
   *
   * If the logout is successful, a success message is displayed and the user is
   * redirected to the login page. If the logout fails, an error message is shown.
   *
   * @returns {Promise<void>} A promise that resolves when the logout process is complete.
   */
  const logout = async () => {
    try {
      await axios.get("/api/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.error(error.message);
      toast.error("Logout failed. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return movies?.length > 0 ? (
    <div className="min-h-screen max-w-[1440px] flex items-start justify-center p-[24px] sm:p-[60px] md:p-[120px]">
      <div className="grid grid-cols-12 gap-4 w-full">
        {/* My Movies Section */}
        <div className="col-span-12 flex items-center justify-between">
          <div
            className=" flex items-center gap-[12px] sm:gap-4 cursor-pointer"
            onClick={onAdd}
          >
            <h2 className="text-white text-[32px] sm:text-[48px] font-[600] leading-[40px] sm:leading-[56px]">
              My Movies
            </h2>
            <Image
              src="/plus.svg"
              alt="Add Movie"
              className="w-[24px] h-[24px] sm:w-[32px] sm:h-[32px] object-contain"
              layout="intrinsic"
              width={32}
              height={32}
            />
          </div>

          {/* Logout Section */}
          <div
            className=" flex items-center gap-4 justify-end cursor-pointer"
            onClick={logout}
          >
            <p className="text-white text-[16px] hidden sm:block">Logout</p>
            <Image
              src="/logout.svg"
              alt="Logout"
              className="w-[32px] h-[32px] object-contain"
              layout="intrinsic"
              width={32}
              height={32}
            />
          </div>
        </div>

        {movies?.map((movie) => (
          <Link
            key={movie._id}
            href={`/edit/${movie._id}`}
            className="col-span-6 sm:col-span-4 md:col-span-3  p-4 cursor-pointer"
          >
            <MovieCard
              title={movie.title}
              year={movie.publishingYear}
              imageUrl={movie.poster}
            />
          </Link>
        ))}

        {/* Full Width Section */}
        {page && (
          <div className="col-span-12 border p-4">
            <div>Prev</div>
            <div>Numner</div>
            <div>Next</div>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-[591px] h-[152px] flex flex-col items-center justify-center space-y-[40px]">
        <h2 className="text-white sm:text-[48px] font-[600] sm:leading-[80px] text-center align-center text-[32px] leading-[40px]">
          Your movie list is empty
        </h2>
        <Button
          type="submit"
          width="w-[380px] sm:w-[202px]"
          height="h-[56px] sm:h-[56px]"
          bgColor="bg-primary"
          className="font-[700] text-white text-[16px] py-[16px] px-[28px]  "
          onClick={onAdd}
        >
          Add a new movie
        </Button>
      </div>
    </div>
  );
}
