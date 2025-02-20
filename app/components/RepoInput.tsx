// components/RepoInput.tsx;

"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [readmeGenerated, setReadmeGenerated] = useState(false); // Track README generation

  // Default content (used when editing before fetching data)
  const defaultContent: Record<string, string> = {
    title: "Project Title",
    description: "Short description about the project.",
    features: "List of features included in the project.",
    techStack: "Technologies used in this project.",
    installation: "Steps to install and run the project.",
    projectStructure: "Folder structure explanation.",
    apiStructure: "API endpoints and how they work.",
    contribution: "Guidelines for contributing.",
    license: "Project license details."
  };

  const handleToggle = (section: string) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleEdit = (section: string) => {
    setEditingSection(section);

    // Ensure text area shows existing content when editing
    setCustomContent((prev) => ({
      ...prev,
      [section]: prev[section] || defaultContent[section] || ""
    }));
  };

  const handleSave = (section: string) => {
    setEditingSection(null);

    // Trigger README update with the latest data
    onGenerate(repoUrl, sections, customContent);
  };

  const handleCustomContentChange = (section: string, content: string) => {
    setCustomContent((prev) => ({ ...prev, [section]: content }));
  };

  const handleGenerate = () => {
    onGenerate(repoUrl, sections, customContent);
    setReadmeGenerated(true); // Mark README as generated
  };

  // **Conditions to Disable Buttons**
  const isRepoUrlEmpty = repoUrl.trim() === "";
  const isReadmeEmpty = Object.keys(customContent).length === 0;

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
              disabled={isRepoUrlEmpty || !readmeGenerated} // Disable initially, enable after README is generated
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
          <Button className="mt-2" onClick={() => handleSave(editingSection)}>
            Save
          </Button>
        </div>
      )}
      <Button
        className="w-full"
        onClick={handleGenerate}
        disabled={isRepoUrlEmpty}
      >
        Generate README
      </Button>
    </div>
  );
}
