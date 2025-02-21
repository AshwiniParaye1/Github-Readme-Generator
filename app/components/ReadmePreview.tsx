// components/ReadmePreview.tsx;

"use client";
import React from "react";
import ReactMarkdown from "react-markdown";

interface ReadmePreviewProps {
  readmeContent: string;
}

export default function ReadmePreview({ readmeContent }: ReadmePreviewProps) {
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(readmeContent);
      alert("README copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      alert("Failed to copy README.");
    }
  };

  const handleDownloadReadme = () => {
    const blob = new Blob([readmeContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border rounded-lg p-6 bg-gray-100 shadow-md">
      <div className="prose max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1
                {...props}
                className="text-3xl font-bold text-center text-gray-800 mb-4"
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                {...props}
                className="text-2xl font-semibold text-gray-700 mt-6 mb-3"
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                {...props}
                className="text-xl font-medium text-gray-600 mt-4 mb-2"
              />
            ),
            p: ({ node, ...props }) => (
              <p {...props} className="text-gray-700 leading-relaxed" />
            ),
            ul: ({ node, ...props }) => (
              <ul {...props} className="list-disc pl-5 text-gray-700" />
            ),
            ol: ({ node, ...props }) => (
              <ol {...props} className="list-decimal pl-5 text-gray-700" />
            ),
            pre: ({ node, ...props }) => (
              <pre
                {...props}
                className="bg-gray-900 text-white p-4 rounded-md overflow-auto"
              />
            ),
            code: ({ node, ...props }) => (
              <code {...props} className="text-red-400" />
            )
          }}
        >
          {readmeContent}
        </ReactMarkdown>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={handleCopyToClipboard}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Copy to Clipboard
        </button>
        <button
          onClick={handleDownloadReadme}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Download README
        </button>
      </div>
    </div>
  );
}
