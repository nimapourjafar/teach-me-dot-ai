import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

export default function UploadFile() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false)
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    //@ts-ignore
    accept: "application/pdf",
    onDrop: (acceptedFiles) => {
      //@ts-ignore
      setSelectedFile(acceptedFiles[0]);
    },
  });

  useEffect(() => {
    if (selectedFile) {
      fileUpload(selectedFile);
    }
  }, [selectedFile]);

  useEffect(() => {
    console.log(selectedFile);
  }, []);

  const fileUpload = async (file: any) => {
    setLoading(true);
    var formdata = new FormData();
    formdata.append("file", file, file.name);
    var requestOptions: RequestInit = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    // @ts-ignore
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

    fetch(process.env.NEXT_PUBLIC_API_ENDPOINT+"upload", requestOptions)
      .then((response) => response.text())

      .then((result) => {
        // save filename to local storage
        const arrayOfFiles = JSON.parse(localStorage.getItem("files") || "[]");
        // @ts-ignore
        arrayOfFiles.push(selectedFile.name);
        localStorage.setItem("files", JSON.stringify(arrayOfFiles));

        // @ts-ignore
        router.push(`/dashboard/${selectedFile.name.slice(0, -4)}`);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div
      {...getRootProps()}
      className={`${
        isDragActive ? "bg-gray-500" : ""
      } rounded-lg p-4 text-center cursor-pointer border-2 border-white border-spacing-3 duration-200 transition`}
    >
      <input {...getInputProps()}  />

      {loading ? (
        <p className="mt-1 text-lg font-medium text-white">Loading...</p>
      ) : null}
      {selectedFile != null ? (
        <>
          <p className="text-lg font-medium text-gray-700">
            {/* @ts-ignore */}
            {selectedFile.name}
          </p>
          <p className="text-sm font-medium text-gray-500">
            {/* @ts-ignore */}
            {Math.round(selectedFile.size / 1024 / 1024)} MB
          </p>
        </>
      ) : (
        <>
          <FiUpload className="mx-auto h-12 w-12 text-white" />
          <p className="mt-1 text-lg font-medium text-white">
            Upload your PDF here!
          </p>
          <p className="mt-1 text-sm text-white">
            Only PDF files up to 10MB are allowed
          </p>
        </>
      )}
    </div>
  );
}
