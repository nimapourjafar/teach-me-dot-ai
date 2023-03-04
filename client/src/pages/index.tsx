import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import UploadFile from "../../components/UploadFile";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const [lastfiles, setLastFiles] = useState<string[]>([]);
  useEffect(() => {
    const files = localStorage.getItem("files");
    if (files) {
      setLastFiles(JSON.parse(files));
    }
  }, []);
  return (
    <>
      <Head>
        <title>TeachMe.AI!</title>
        <meta name="description" content="The homepage to TeachMe.AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className=" align-middle text-center space-y-2">
          <h1 className="text-5xl font-bold text-white tracking-wider">
            TeachMe.AI
          </h1>
          <p>Upload a book, autobiography, or textbook.</p>
          <p>
            Then, use the power of AI to get talk to the authors, ask questions,
            summarize chapters, and even get customized quizzes.
          </p>
        </div>

        <div className={styles.center}>
          <UploadFile />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wider">
            Sample Texts
          </h2>
        </div>
        <div className={styles.grid}>
          <a
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              router.push("/dashboard/axler");
            }}
          >
            <h2 className={inter.className}>
              Linear Algebra - Sheldon Axler <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Learn about linear algebra in this interactive textbook.
            </p>
          </a>

          <a
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              router.push("/dashboard/principles");
            }}
          >
            <h2 className={inter.className}>
              Principles - Ray Dalio <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Billionaire hedge fund manager Ray Dalio shares his principles for
              success.
            </p>
          </a>

          <a
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              router.push(
                "/dashboard/Harcourt-Mathematics-12-Advanced-Functions-and-Introductory-Calculus"
              );
            }}
          >
            <h2 className={inter.className}>
              Intro to Calculus - Harcourt Math <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Have a calc test coming up? Get all your answers and practice
              here!
            </p>
          </a>
        </div>
        <div className="flex flex-col  space-y-2">
          <h2>
            Previously uploaded texts will be available here for you to use.
          </h2>
          {lastfiles.map((file) => {
            // get rid of .pdf from file
            return (
              <div
                key={file}
                onClick={() => {
                  router.push(`/dashboard/${file.split(".pdf")[0]}`);
                }}
                className="text-blue-500 cursor-pointer"
              >
                {file.split(".pdf")[0]}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
