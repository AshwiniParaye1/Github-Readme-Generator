"use client";

import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col text-white bg-gradient-to-br from-black via-black to-blue-950">
      {/* Header */}
      <Header />

      <main className="mt-10 flex flex-col items-center justify-center text-center flex-grow px-6 py-12">
        {/* Project Introduction */}
        <h1 className="text-2xl sm:text-4xl font-extrabold mb-6 leading-tight max-w-3xl">
          Create a Professional GitHub README in Seconds
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mb-6">
          A well-structured README makes your project stand out. Just enter your
          GitHub repo link, and we’ll generate a complete README with all the
          essential details. No more writing from scratch!
        </p>

        {/* How to Use Section */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg max-w-2xl w-full">
          <h2 className="text-xl font-semibold mb-4 text-white">
            How It Works
          </h2>
          <p className="mb-4 text-gray-300">
            Getting started is simple. Just follow these steps:
          </p>
          <ol className="list-decimal pl-6 space-y-3 text-left text-gray-300">
            <li>
              Paste your{" "}
              <span className="font-medium text-white">
                GitHub repository URL
              </span>
              .
            </li>
            <li>
              We’ll analyze your project and generate a structured README.
            </li>
            <li>Customize the details if needed.</li>
            <li>Download your polished README and make your repo shine!</li>
          </ol>
        </div>

        {/* Button to Generate README */}
        <div className="mt-10 mb-10">
          <Button className="w-full sm:w-auto px-6 py-3 text-lg font-semibold bg-gradient-to-br from-black to-blue-950 hover:brightness-125 transition-transform transform hover:scale-105 rounded-md shadow-lg">
            <Link href={"/generate-readme"} className="text-white">
              Generate My README
            </Link>
          </Button>
        </div>

        {/* Toast Notification Container */}
        <ToastContainer position="top-right" autoClose={3000} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
