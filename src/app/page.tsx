"use client";
import Button from "@/components/Button";
import MovieCard from "@/components/MovieCard";
import { useResponsive } from "@/hooks";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Movie {
  _id: string;
  title: string;
  publishingYear: number;
  poster: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalMovies: number;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalMovies: 0,
  });
  const limit = 8;
  const [hasMore, setHasMore] = useState<boolean>(true);

  const router = useRouter();
  const infiniteScrollRef = useRef<HTMLDivElement | null>(null);
  const { isSmallDevice } = useResponsive();
  console.log(isSmallDevice);

  const fetchMovies = async (page: number = 1, append: boolean = false) => {
    setLoading(true);
    try {
      const response = await axios.get("/api/movies", {
        params: { page, limit },
      });
      const fetchedMovies = response.data.movies;

      setMovies((prevMovies) =>
        append ? [...prevMovies, ...fetchedMovies] : fetchedMovies
      );

      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalMovies: response.data.pagination.totalMovies,
      });

      setHasMore(page < response.data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMovies = () => {
    if (hasMore && !loading) {
      fetchMovies(pagination.currentPage + 1, true);
    }
  };

  const onAdd = () => {
    router.push("/add");
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      fetchMovies(page);
    }
  };

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

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (isSmallDevice) {
      console.log(hasMore);

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreMovies();
          }
        },
        { threshold: 1 }
      );

      if (infiniteScrollRef.current) {
        observer.observe(infiniteScrollRef.current);
      }

      return () => {
        if (infiniteScrollRef.current) {
          observer.unobserve(infiniteScrollRef.current);
        }
      };
    }
  }, [isSmallDevice, infiniteScrollRef, pagination.currentPage, hasMore]);

  if (loading && movies.length === 0) {
    return <p>Loading...</p>;
  }

  return movies?.length > 0 ? (
    <div className="min-h-screen lg:max-w-[1440px] flex items-start justify-center px-[24px] sm:px-8 md:px-12 lg:px-16 xl:px-24 py-8 md:py-12">
      <div className="grid grid-cols-12 gap-4 w-full">
        {/* Header */}
        <div className="col-span-12 flex items-center justify-between mb-[80px]">
          <div
            className="flex items-center gap-[12px] sm:gap-4 cursor-pointer"
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
              width={24}
              height={24}
            />
          </div>
          <div
            className="flex items-center gap-4 justify-end cursor-pointer"
            onClick={logout}
          >
            <p className="text-white text-[16px] hidden sm:block">Logout</p>
            <Image
              src="/logout.svg"
              alt="Logout"
              className="object-contain"
              layout="intrinsic"
              width={24}
              height={24}
            />
          </div>
        </div>

        {/* Movie List */}
        <div className="flex col-span-12 justify-center items-center flex-wrap gap-4 w-full">
          {movies?.map((movie) => (
            <Link
              key={movie._id}
              href={`/edit/${movie._id}`}
              className="cursor-pointer"
            >
              <MovieCard
                title={movie.title}
                year={movie.publishingYear}
                imageUrl={movie.poster}
              />
            </Link>
          ))}
        </div>

        {/* Infinite Scroll Ref for Small Devices */}
        {isSmallDevice && (
          <div
            ref={infiniteScrollRef}
            className="col-span-12 flex justify-center items-center my-4"
          >
            {loading && <p>Loading more movies...</p>}
          </div>
        )}

        {/* Pagination for Larger Devices */}
        {!isSmallDevice && (
          <div className="col-span-12 flex items-center justify-center gap-[15px] text-white text-[16px] font-[700] m-4">
            <button
              onClick={() => goToPage(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="cursor-pointer"
            >
              Prev
            </button>
            <div className="flex items-center justify-center gap-[9px]">
              {Array.from({ length: pagination.totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => goToPage(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    pagination.currentPage === index + 1
                      ? "bg-primary"
                      : "bg-cardColor"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => goToPage(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="cursor-pointer"
            >
              Next
            </button>
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
          className="font-[700] text-white text-[16px] py-[16px] px-[28px]"
          onClick={onAdd}
        >
          Add a new movie
        </Button>
      </div>
    </div>
  );
}
