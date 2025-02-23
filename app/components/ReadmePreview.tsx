/* eslint-disable @typescript-eslint/no-unused-vars */
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
    <div className="rounded-lg shadow-md overflow-hidden bg-gray-900 border border-gray-700">
      <div className="px-6 py-4 h-[504px] overflow-y-auto relative bg-pattern">
        {/* Added bg-pattern class */}
        {hasReadmeContent ? (
          <div className="prose max-w-none text-white">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => (
                  <h1
                    {...props}
                    className="text-3xl font-bold text-center text-white mb-4 border-b border-gray-700 pb-2"
                  />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    {...props}
                    className="text-2xl font-semibold text-gray-300 mt-6 mb-3"
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    {...props}
                    className="text-xl font-medium text-gray-400 mt-4 mb-2"
                  />
                ),
                p: ({ node, ...props }) => (
                  <p {...props} className="text-gray-300 leading-relaxed" />
                ),
                ul: ({ node, ...props }) => (
                  <ul {...props} className="list-disc pl-5 text-gray-300" />
                ),
                ol: ({ node, ...props }) => (
                  <ol {...props} className="list-decimal pl-5 text-gray-300" />
                ),
                pre: ({ node, ...props }) => (
                  <pre className="bg-gray-800 text-gray-200 p-4 rounded-md overflow-auto">
                    <code {...props} />
                  </pre>
                ),
                code: ({ node, ...props }) => (
                  <code {...props} className="text-red-400" />
                )
              }}
            >
              {readmeContent}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-center">
            <div className="flex flex-col items-center w-full">
              <FaGithub className="inline-block mb-2 text-4xl animate-pulse" />
              {/* Added animate-pulse */}
              <span className="text-lg">README will be generated here</span>
            </div>
          </div>
        )}
      </div>
      {/* Buttons Section */}
      {hasReadmeContent && (
        <div className="px-6 py-4 bg-gray-800 border-t border-gray-700 flex justify-end gap-4">
          <button
            onClick={handleCopyToClipboard}
            className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-br from-black to-blue-950 hover:brightness-125 transition-transform transform hover:scale-105 rounded-md shadow-lg flex items-center"
          >
            <FaCopy className="mr-2" />
            Copy
          </button>
          <button
            onClick={handleDownloadReadme}
            className="px-6 py-2 text-lg font-semibold text-white bg-gradient-to-br from-black to-blue-950 hover:brightness-125 transition-transform transform hover:scale-105 rounded-md shadow-lg flex items-center"
          >
            <FaDownload className="mr-2" />
            Download
          </button>
        </div>
      )}
    </div>
  );
}
