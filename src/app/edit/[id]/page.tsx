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
    <div className="min-h-[calc(100vh-111px)] flex flex-col items-start justify-center m-[24px] sm:m-[120px] gap-[80px] sm:gap-[120px] w-[380px] max-w-[380px] sm:w-full sm:max-w-full ">
      <div className="w-full sm:w-auto text-white text-[32px] sm:text-[48px] font-[600] leading-[56px] ">
        Create a new movie
      </div>
      <div className="w-full flex items-start justify-between gap-[127px]">
        <div className="sm:block hidden ">
          <SingleImageDropzone
            width={473}
            height={504}
            className="w-[473px] h-[504px]"
            value={file}
            onChange={(file) => {
              setFile(file);
            }}
          />
        </div>
        <div className="flex flex-col items-start justify-center sm:gap-[64px] w-full ">
          <div className="flex flex-col items-start justify-center gap-[25px] mb-[24px] w-full sm:w-auto">
            <InputField
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              width="w-full  sm:w-[362px] "
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
              width="w-full  sm:w-[216px] ]"
              height="h-[45px]"
              bgColor="bg-inputColor"
              className="focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="sm:hidden block mb-[40px] sh:mb-0 w-full">
            <SingleImageDropzone
              // width={380}
              // height={372}
              width={0}
              height={0}
              className="w-full h-[372px] "
              value={file}
              onChange={(file) => {
                setFile(file);
              }}
            />
          </div>
          <div className="flex items-center justify-start gap-[16px] w-full ">
            <Button
              width="w-full sm:w-[167px] "
              height="h-[56px]"
              type="button"
              className="text-white font-[700] text-[16px] border"
              onClick={() => router.back()}
            >
              Cancle
            </Button>

            <Button
              width="w-full sm:w-[167px] "
              height="h-[56px]"
              type="button"
              bgColor="bg-primary"
              className="text-white font-[700] text-[16px]"
              onClick={editMovie}
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
