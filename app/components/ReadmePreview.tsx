// components/ReadmePreview.tsx;

"use client";
import ReactMarkdown from "react-markdown";

interface ReadmePreviewProps {
  readmeContent: string;
}

export default function ReadmePreview({ readmeContent }: ReadmePreviewProps) {
  return (
    <div className="border rounded p-4 overflow-auto">
      <ReactMarkdown>{readmeContent}</ReactMarkdown>
    </div>
  );
}
