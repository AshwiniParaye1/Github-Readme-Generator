// components/RepoInput.tsx;

"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fetchRepoData } from "../utils/fetchRepoData";

interface RepoInputProps {
  onGenerate: (
    repoUrl: string,
    sections: Record<string, boolean>,
    customContent: Record<string, string>
  ) => void;
}

export default function RepoInput({ onGenerate }: RepoInputProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [sections, setSections] = useState<Record<string, boolean>>({
    title: true,
    description: true,
    features: false,
    techStack: true,
    installation: true,
    projectStructure: false,
    apiStructure: false,
    contribution: false,
    license: false
  });

  const [customContent, setCustomContent] = useState<Record<string, string>>(
    {}
  );
  const [latestRepoData, setLatestRepoData] = useState<Record<string, string>>(
    {}
  );
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [originalContent, setOriginalContent] = useState<string>("");
  const [readmeGenerated, setReadmeGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = (section: string) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleEdit = (section: string) => {
    // Get current content from either customContent or latestRepoData
    const currentContent =
      customContent[section] || latestRepoData[section] || "";
    setOriginalContent(currentContent);
    setCustomContent((prev) => ({
      ...prev,
      [section]: currentContent
    }));
    setEditingSection(section);
  };

  const handleSave = (section: string) => {
    setEditingSection(null);
    onGenerate(repoUrl, sections, customContent);
  };

  const handleCancel = () => {
    if (editingSection) {
      setCustomContent((prev) => ({
        ...prev,
        [editingSection]: originalContent
      }));
    }
    setEditingSection(null);
  };

  const handleCustomContentChange = (section: string, content: string) => {
    setCustomContent((prev) => ({ ...prev, [section]: content }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setReadmeGenerated(false);

    const repoData = await fetchRepoData(repoUrl);
    if (repoData) {
      const newLatestRepoData = {
        title: repoData.name,
        description: repoData.description || "No description available.",
        features:
          repoData.topics.length > 0 ? `- ${repoData.topics.join("\n- ")}` : "",
        techStack:
          repoData.languages.length > 0
            ? `- ${repoData.languages.join("\n- ")}`
            : "",
        installation: `\`\`\`sh\ngit clone https://github.com/${repoData.owner}/${repoData.repo}.git\ncd ${repoData.repo}\nnpm install\n\`\`\``,
        projectStructure: repoData.projectStructure || "",
        apiStructure: "",
        contribution:
          "Contributions are welcome! Please open an issue or submit a pull request.",
        license:
          "This project is licensed under the MIT License - see the LICENSE file for details."
      };

      setLatestRepoData(newLatestRepoData);
      setReadmeGenerated(true);
      onGenerate(repoUrl, sections, customContent);
    }

    setIsLoading(false);
  };

  const isRepoUrlEmpty = repoUrl.trim() === "";
  const isReadmeGenerated =
    readmeGenerated && Object.keys(latestRepoData).length > 0;

  return (
    <div className="p-4 space-y-4">
      <Input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Enter GitHub repo URL (e.g., https://github.com/user/repo)"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
      />
      <div className="space-y-2">
        {Object.entries(sections).map(([section, isEnabled]) => (
          <div key={section} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                checked={isEnabled}
                onCheckedChange={() => handleToggle(section)}
                disabled={isRepoUrlEmpty}
              />
              <span className="capitalize">{section}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(section)}
              disabled={isRepoUrlEmpty || !isReadmeGenerated || !isEnabled}
            >
              Edit
            </Button>
          </div>
        ))}
      </div>

      {editingSection && (
        <div className="mt-4">
          <Textarea
            value={customContent[editingSection] || ""}
            onChange={(e) =>
              handleCustomContentChange(editingSection, e.target.value)
            }
            placeholder={`Update ${editingSection}`}
            rows={6}
          />
          <div className="mt-2 flex space-x-2">
            <Button onClick={() => handleSave(editingSection)}>Save</Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Button
        className="w-full"
        onClick={handleGenerate}
        disabled={isRepoUrlEmpty}
      >
        {isLoading ? "Generating..." : "Generate README"}
      </Button>
    </div>
  );
}
