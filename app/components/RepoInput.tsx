// components/RepoInput.tsx;

import { useState } from "react";

interface RepoInputProps {
  onGenerate: (repoUrl: string) => void;
}

export default function RepoInput({ onGenerate }: RepoInputProps) {
  const [repoUrl, setRepoUrl] = useState("");

  return (
    <div className="p-4 text-black">
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Enter GitHub repo URL (e.g., https://github.com/user/repo)"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => onGenerate(repoUrl)}
      >
        Generate README
      </button>
    </div>
  );
}
