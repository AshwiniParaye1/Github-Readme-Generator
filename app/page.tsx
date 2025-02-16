//app/page.tsx

"use client";

import { useState } from "react";
import { fetchRepoData } from "./utils/fetchRepoData";
import { generateReadme } from "./utils/generateReadme";
import ReadmePreview from "./components/ReadmePreview";
import RepoInput from "./components/RepoInput";

export default function Home() {
  const [readmeContent, setReadmeContent] = useState("");

  const handleGenerate = async (repoUrl: string) => {
    const repoData = await fetchRepoData(repoUrl);
    if (repoData) {
      setReadmeContent(generateReadme(repoData));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center">
        GitHub README Generator
      </h1>
      <RepoInput onGenerate={handleGenerate} />
      {readmeContent && <ReadmePreview readmeContent={readmeContent} />}
    </div>
  );
}
