//app/page.tsx

"use client";

import { useState } from "react";
import { fetchRepoData } from "./utils/fetchRepoData";
import { generateReadme } from "./utils/generateReadme";
import RepoInput from "./components/RepoInput";
import ReadmePreview from "./components/ReadmePreview";

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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        GitHub README Generator
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RepoInput onGenerate={handleGenerate} />
        {readmeContent && <ReadmePreview readmeContent={readmeContent} />}
      </div>
    </div>
  );
}
