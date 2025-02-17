//app/page.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [readme, setReadme] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const generateReadme = async () => {
    try {
      setLoading(true);

      // Send only the GitHub repository URL
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ repoUrl })
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setReadme(data.readme);
      toast.success("README generated successfully!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate README";
      console.error("Error generating README:", error);
      toast.error(message);
      setReadme("");
    } finally {
      setLoading(false);
    }
  };

  const downloadReadme = () => {
    try {
      const blob = new Blob([readme], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "README.md";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("README downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download README");
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 py-8">
      <div className="w-full sm:w-4/5 md:w-3/5 lg:w-2/5 space-y-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
            Repository README Generator
          </h1>
          <p className="text-lg text-white/80 text-purple-500">
            Generate professional README files from your GitHub repository URL
          </p>
        </div>

        <Card className="bg-white shadow-lg rounded-lg p-8 space-y-6 border border-gray-200">
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">
              Enter your repository URL:
            </label>
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/your/repo"
              className="w-full p-4 text-lg rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            onClick={generateReadme}
            disabled={loading || !repoUrl.trim()}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-blue-500 rounded-lg py-3 text-lg font-semibold"
          >
            {loading ? (
              <Image
                src={"/generating.gif"}
                width={20}
                height={20}
                alt="generating"
              />
            ) : (
              <>
                <FileText className="mr-2 h-5 w-5" />
                Generate README
              </>
            )}
          </Button>
        </Card>

        {readme && (
          <Card className="bg-white shadow-lg rounded-lg p-8 space-y-6 border border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Generated README
              </h2>
              <div className="space-x-4 mt-4 md:mt-0 flex items-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(readme);
                    toast.success("Copied to clipboard!");
                  }}
                >
                  Copy to Clipboard
                </Button>
                <Button variant="default" onClick={downloadReadme}>
                  <Download className="mr-2 h-5 w-5" />
                  Download README
                </Button>
              </div>
            </div>
            <pre className="p-6 bg-gray-50 rounded-lg overflow-auto text-sm text-gray-800">
              {readme}
            </pre>
          </Card>
        )}
      </div>
    </main>
  );
}
