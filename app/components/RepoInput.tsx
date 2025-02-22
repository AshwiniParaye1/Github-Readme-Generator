// components/RepoInput.tsx

"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { fetchRepoData } from "../utils/fetchRepoData";
import { FaGithub } from "react-icons/fa";

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
    contribution: true,
    license: false,
    howToUse: false,
    support: true
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
    // Call onGenerate here to update the ReadmePreview
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
        description: repoData.description,
        features:
          repoData.topics.length > 0 ? `- ${repoData.topics.join("\n- ")}` : "",
        techStack:
          repoData.languages.length > 0 ||
          repoData.frameworks.length > 0 ||
          repoData.databases.length > 0
            ? `- ${[
                ...repoData.languages,
                ...repoData.frameworks,
                ...repoData.databases
              ]
                .filter(Boolean)
                .join("\n- ")}`
            : "- No technologies detected.",
        installation: `\`\`\`sh\ngit clone https://github.com/${repoData.owner}/${repoData.repo}.git\ncd ${repoData.repo}\nnpm install\n\`\`\``,
        projectStructure: repoData.projectStructure || "",
        contribution: `We welcome contributions! Here's how you can contribute:\n
1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them.
4.  Push your changes to your fork.
5.  Submit a pull request.`,
        license:
          "This project is licensed under the MIT License - see the LICENSE file for details.",
        howToUse: "Provide instructions on how to use your project here.", // Added howToUse
        support: `Thank you for checking out ${repoData.name}! If you find it useful, consider giving it a star on GitHub!`
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
    <div className="rounded-lg shadow-md p-6 flex flex-col h-full bg-white/80 backdrop-blur-md border border-gray-200">
      {/* Input and Switches */}
      <div>
        <Input
          type="text"
          className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
          placeholder="Enter GitHub Repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <div className="mt-6 space-y-2">
          {Object.entries(sections).map(([section, isEnabled]) => (
            <div key={section} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={isEnabled}
                  onCheckedChange={() => handleToggle(section)}
                  disabled={isRepoUrlEmpty}
                />
                <span className="text-gray-700 capitalize">{section}</span>
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
              className="w-full p-2 border rounded focus:ring-purple-500 focus:border-purple-500"
            />
            <div className="mt-2 flex space-x-2">
              <Button onClick={() => handleSave(editingSection)}>Save</Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Generate Button - Pushed to the bottom */}
      <div className="mt-auto">
        <Button
          className="w-full mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          onClick={handleGenerate}
          disabled={isRepoUrlEmpty}
        >
          {isLoading ? (
            "Generating..."
          ) : (
            <>
              Generate README <FaGithub className="ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
