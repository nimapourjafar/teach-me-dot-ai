import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
          <div className={styles.thirteen}>
            <Image
              src="/thirteen.svg"
              alt="13"
              width={40}
              height={31}
              priority
            />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wider">
            Sample Texts
          </h2>
        </div>
        <div className={styles.grid}>


          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Linear Algebra - Sheldon Axler <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Learn about linear algebra in this interactive textbook.
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Principles - Ray Dalio <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Billionaire hedge fund manager Ray Dalio shares his principles for success.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Intro to Calculus - Harcourt Math <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Have a calc test coming up? Get all your answers and practice here!
            </p>
          </a>
        </div>
      </main>
    </>
  );
}
