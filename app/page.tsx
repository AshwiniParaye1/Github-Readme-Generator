// app/page.tsx
"use client";

import { useState } from "react";
import { fetchRepoData } from "./utils/fetchRepoData";
import { generateReadme } from "./utils/generateReadme";
import RepoInput from "./components/RepoInput";
import ReadmePreview from "./components/ReadmePreview";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Home() {
  const [readmeContent, setReadmeContent] = useState("");

  const handleGenerate = async (
    repoUrl: string,
    sections: Record<string, boolean>,
    customContent: Record<string, string>
  ) => {
    const repoData = await fetchRepoData(repoUrl);
    if (repoData) {
      setReadmeContent(generateReadme(repoData, sections, customContent));
    }
  };

  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
      {/* Header */}
      <Header />

      <main className="container mx-auto px-4 my-4 sm:px-6 lg:px-8 py-20 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RepoInput onGenerate={handleGenerate} />
          <ReadmePreview readmeContent={readmeContent} />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
