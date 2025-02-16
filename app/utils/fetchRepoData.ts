// utils/fetchRepoData.ts
import axios from "axios";

interface FileContent {
  name: string;
  content: string;
  path: string;
}

interface RepoData {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  topics: string[];
  languages: string[];
  owner: string;
  repo: string;
  files: FileContent[];
  dependencies: Record<string, string>;
  hasTests: boolean;
  mainFile: string | null;
  scripts: Record<string, string>;
}

export async function fetchRepoData(repoUrl: string): Promise<RepoData | null> {
  try {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) throw new Error("Invalid GitHub URL");

    const [, owner, repo] = match;
    const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;

    // Fetch basic repo data
    const { data: repoData } = await axios.get(baseUrl);

    // Fetch repository contents
    const { data: contents } = await axios.get(`${baseUrl}/contents`);

    // Get package.json if it exists
    let packageJson = null;
    const packageJsonFile = contents.find(
      (file: any) => file.name === "package.json"
    );
    if (packageJsonFile) {
      const { data: packageData } = await axios.get(
        packageJsonFile.download_url
      );
      packageJson =
        typeof packageData === "string" ? JSON.parse(packageData) : packageData;
    }

    // Fetch main source files content
    const sourceFiles = contents.filter((file: any) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      return [
        "js",
        "ts",
        "jsx",
        "tsx",
        "py",
        "java",
        "go",
        "rs",
        "cpp",
        "c"
      ].includes(ext);
    });

    const files: FileContent[] = await Promise.all(
      sourceFiles.map(async (file: any) => {
        const { data: content } = await axios.get(file.download_url);
        return {
          name: file.name,
          content:
            typeof content === "string" ? content : JSON.stringify(content),
          path: file.path
        };
      })
    );

    // Fetch languages and topics
    const { data: languages } = await axios.get(`${baseUrl}/languages`);
    const { data: topicsData } = await axios.get(`${baseUrl}/topics`, {
      headers: { Accept: "application/vnd.github.mercy-preview+json" }
    });

    return {
      name: repoData.name,
      description: repoData.description || "No description available.",
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      language: repoData.language || "Not specified",
      topics: topicsData.names || [],
      languages: Object.keys(languages),
      owner: repoData.owner.login,
      repo: repo,
      files,
      dependencies: packageJson?.dependencies || {},
      hasTests: files.some(
        (file) => file.name.includes("test") || file.name.includes("spec")
      ),
      mainFile: packageJson?.main || null,
      scripts: packageJson?.scripts || {}
    };
  } catch (error) {
    console.error("Error fetching repo data:", error);
    return null;
  }
}
