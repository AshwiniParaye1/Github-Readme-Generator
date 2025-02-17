//app/page.tsx

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Loader2, Download } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function Home() {
  const [files, setFiles] = useState<string>("");
  const [readme, setReadme] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const generateReadme = async () => {
    try {
      setLoading(true);
      const filesArray = files.split("\n\n").map((fileContent, index) => ({
        name: `file_${index + 1}.txt`,
        content: fileContent.trim()
      }));

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: filesArray })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12 md:px-8 max-w-4xl">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Repository README Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your repository documentation with AI-powered README
            generation
          </p>
        </div>

        <Card className="p-8 shadow-xl rounded-xl border border-gray-200 backdrop-blur-sm bg-white/50 mb-8">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700">
              Repository Files and Code
            </label>
            <Textarea
              value={files}
              onChange={(e) => setFiles(e.target.value)}
              placeholder="Paste your repository files and code here..."
              className="h-48 font-mono text-sm bg-gray-50 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          <Button
            onClick={generateReadme}
            disabled={loading || !files.trim()}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Generating Your README...
              </>
            ) : (
              <>
                <FileText className="mr-3 h-5 w-5" />
                Generate README
              </>
            )}
          </Button>
        </Card>

        {readme && (
          <Card className="p-8 shadow-xl rounded-xl border border-gray-200 backdrop-blur-sm bg-white/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Your Generated README
              </h2>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(readme);
                    toast.success("Copied to clipboard!");
                  }}
                  className="flex-1 md:flex-none border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
                >
                  Copy to Clipboard
                </Button>
                <Button
                  variant="default"
                  onClick={downloadReadme}
                  className="flex-1 md:flex-none bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download README
                </Button>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <pre className="p-6 bg-gray-50 rounded-lg overflow-auto border border-gray-200 text-sm font-mono">
                {readme}
              </pre>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
