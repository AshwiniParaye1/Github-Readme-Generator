//app/page.tsx

"use client";

import { useState } from "react";
import { fetchRepoData } from "./utils/fetchRepoData";
import { generateReadme } from "./utils/generateReadme";
import RepoInput from "./components/RepoInput";
import ReadmePreview from "./components/ReadmePreview";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    <div className="bg-gradient-to-br from-blue-100 to-green-100 min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          GitHub README Generator
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RepoInput onGenerate={handleGenerate} />
          {readmeContent && (
            <ReadmePreview
              readmeContent={readmeContent}
              className="h-full" // Make preview fill available height
            />
          )}
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}
