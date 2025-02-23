"use client";

import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchRepoData } from "../utils/fetchRepoData";
import Header from "../components/Header";
import RepoInput from "../components/RepoInput";
import ReadmePreview from "../components/ReadmePreview";
import { generateReadme } from "../utils/generateReadme";
import Footer from "../components/Footer";

export default function GenerateReadme() {
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
    <div className="mt-10 mb-10 flex flex-col min-h-screen bg-gradient-to-br from-black via-black to-blue-950 text-white">
      {/* Header */}
      <Header />

      <main className="flex flex-col flex-grow px-4 py-10 sm:px-6 lg:px-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
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
