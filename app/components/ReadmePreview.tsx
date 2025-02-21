// components/ReadmePreview.tsx

"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "react-toastify";
import { FaCopy, FaDownload, FaGithub } from "react-icons/fa";

interface ReadmePreviewProps {
  readmeContent: string;
}

export default function ReadmePreview({ readmeContent }: ReadmePreviewProps) {
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(readmeContent);
      toast.success("Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy README.");
    }
  };

  const handleDownloadReadme = () => {
    try {
      const blob = new Blob([readmeContent], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "README.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("README downloaded!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download README.");
    }
  };

  const hasReadmeContent = readmeContent.trim() !== "";

  return (
    <div className="rounded-lg shadow-md overflow-hidden bg-white/80 backdrop-blur-md border border-gray-200">
      <div className="px-6 py-4 h-[504px] overflow-y-auto relative">
        {hasReadmeContent ? (
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
                  <pre className="bg-gray-100 text-gray-800 p-4 rounded-md overflow-auto">
                    <code {...props} />
                  </pre>
                ),
                code: ({ node, ...props }) => (
                  <code {...props} className="text-red-500" />
                )
              }}
            >
              {readmeContent}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-center">
            <FaGithub className="inline-block mr-2 text-2xl" />
            <span>README will be generated here</span>
          </div>
        )}
      </div>
      <div className="px-6 py-4 bg-blue-50 border-t border-gray-200 flex justify-end gap-4">
        <button
          onClick={handleCopyToClipboard}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          disabled={!hasReadmeContent}
        >
          <FaCopy className="mr-2" />
          Copy
        </button>
        <button
          onClick={handleDownloadReadme}
          className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          disabled={!hasReadmeContent}
        >
          <FaDownload className="mr-2" />
          Download
        </button>
      </div>
    </div>
  );
}
