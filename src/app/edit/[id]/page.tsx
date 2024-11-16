"use client";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import { SingleImageDropzone } from "@/components/SingleImageDropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

/**
 * Page component for adding a new movie.
 *
 * This component allows users to add a new movie to the database.
 * It includes a form with fields for the movie title and publishing year,
 * as well as a file input for uploading a poster image.
 *
 * When the form is submitted, the component sends a POST request to
 * the server with the movie data and the uploaded poster image.
 * If the request is successful, the component redirects the user to the
 * home page.
 *
 * The component also includes some basic error handling, such as displaying
 * an error message if the user tries to submit the form without filling in all
 * the required fields.
 */
export default function EditMovie() {
  const [title, setTitle] = useState<string>("");
  const [Pyear, setPyear] = useState<string>("");
  const [file, setFile] = useState<File | string>();
  const [loading, setLoading] = useState<boolean>(false);

  const { edgestore } = useEdgeStore();

  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (id) {
      axios.get(`/api/movies/${id}`).then((response) => {
        setTitle(response.data.movie.title);
        setFile(response.data.movie.poster);
        setPyear(response.data.movie.publishingYear.toString());
      });
    }
  }, [id]);

  const editMovie = async () => {
    setLoading(true);
    try {
      if (!title || !Pyear || !file) return;
      let posterUrl;
      if (typeof file !== "string") {
        const res = await edgestore.publicFiles.upload({ file });
        posterUrl = res.url;
      }

      await axios.patch(`/api/movies/${id}`, {
        title,
        publishingYear: parseInt(Pyear),
        poster: posterUrl,
      });
      toast.success("Movie updated successfully!");
      router.push("/");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex flex-col items-start justify-center p-[24px] sm:p-[120px] gap-[120px]">
      <div className="w-full text-white text-[48px] font-[600] leading-[56px] ">
        Edit movie
      </div>
      <div className="flex items-start justify-between gap-[127px]">
        <div>
          <SingleImageDropzone
            width={473}
            height={504}
            value={file}
            onChange={(file) => {
              setFile(file);
            }}
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-[64px] ">
          <div className="flex flex-col items-start justify-center gap-[25px] ">
            <InputField
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              width="w-[362px]"
              height="h-[45px]"
              bgColor="bg-inputColor"
              className="focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <InputField
              id="title"
              type="text"
              value={Pyear}
              onChange={(e) => setPyear(e.target.value)}
              placeholder="Publishing year"
              width="w-[216px]"
              height="h-[45px]"
              bgColor="bg-inputColor"
              className="focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-center gap-[16px]">
            <Button
              width="w-[167px]"
              height="h-[56px]"
              type="button"
              className="text-white font-[700] text-[16px] border "
              onClick={() => router.back()}
            >
              Cancel
            </Button>

            <Button
              width="w-[167px]"
              height="h-[56px]"
              type="button"
              bgColor="bg-primary"
              className="text-white font-[700] text-[16px]"
              onClick={editMovie}
              disabled={loading}
            >
              {loading ? "Loading..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
