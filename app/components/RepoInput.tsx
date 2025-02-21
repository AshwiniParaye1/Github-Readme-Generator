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
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleToggle = (section: string) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleEdit = (section: string) => {
    setOriginalContent(customContent[section] || latestRepoData[section] || "");
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
    setIsLoading(true); // Show loading message
    setReadmeGenerated(false);

    const repoData = await fetchRepoData(repoUrl);
    if (repoData) {
      setLatestRepoData({
        title: repoData.name,
        description: repoData.description || "No description available.",
        features:
          repoData.topics.length > 0 ? repoData.topics.join("\n- ") : "",
        techStack:
          repoData.languages.length > 0 ? repoData.languages.join("\n- ") : "",
        installation: `\`\`\`sh\ngit clone https://github.com/${repoData.owner}/${repoData.repo}.git\ncd ${repoData.repo}\nnpm install\n\`\`\``
      });

      setReadmeGenerated(true);
      onGenerate(repoUrl, sections, customContent);
    }

    setIsLoading(false); // Hide loading message
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
