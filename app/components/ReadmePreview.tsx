// components/ReadmePreview.tsx;

import ReactMarkdown from "react-markdown";
import fileDownload from "js-file-download";

interface ReadmePreviewProps {
  readmeContent: string;
}

export default function ReadmePreview({ readmeContent }: ReadmePreviewProps) {
  const handleDownload = () => {
    fileDownload(readmeContent, "README.md");
  };

  return (
    <div className="p-4 border rounded bg-gray-100 text-black">
      <h2 className="text-xl font-bold">📄 README Preview</h2>
      <div className="bg-white p-2 rounded shadow mt-2">
        <ReactMarkdown>{readmeContent}</ReactMarkdown>
      </div>
      <button
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
        onClick={handleDownload}
      >
        Download README.md
      </button>
    </div>
  );
}
