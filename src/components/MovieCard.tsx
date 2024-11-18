// components/MovieCard.tsx
import Image from "next/image";

type MovieCardProps = {
  title: string;
  year: number;
  imageUrl: string;
};

/**
 * A MovieCard component represents an individual movie with its title, year of release and image.
 * The component is a rectangular card with a rounded corner and a drop shadow on hover.
 * The image is displayed on top of the card with a aspect ratio of 1:1.5.
 * The title and year of release are displayed below the image.
 * @param {{ title: string, year: number, imageUrl: string }} props
 * @returns {JSX.Element}
 */
const MovieCard: React.FC<MovieCardProps> = ({ title, year, imageUrl }) => {
  return (
    <div className=" min-w-[180px] min-h-[334px] md:min-w-[282px] md:h-[504px] max-w-xs mx-auto bg-cardColor rounded-[12px] overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-[246px] sm:h-[400px]">
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-[12px] p-2 "
        />
      </div>
      <div className="p-4 text-white">
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="text-gray-400">{year}</p>
      </div>
    </div>
  );
};

export default MovieCard;
