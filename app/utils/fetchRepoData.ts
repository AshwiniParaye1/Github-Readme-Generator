//utils/fetchRepoData.ts

import axios from "axios";
import { toast } from "react-toastify";

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

// Function to fetch repository data
export async function fetchRepoData(repoUrl: string) {
  try {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      toast.error("Invalid GitHub Repository URL.");
      console.error("Invalid GitHub Repository URL.");
      return null;
    }

    const [, owner, repo] = match;
    const headers = GITHUB_TOKEN
      ? { Authorization: `Bearer ${GITHUB_TOKEN}` }
      : {};

    // Fetch repository details
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    // Fetch repository file structure
    const treeData = await fetchRepoTree(owner, repo, headers);

    // Fetch languages
    const languages = await fetchLanguages(owner, repo, headers);

    // Fetch package.json to detect frameworks & databases
    const { frameworks, databases } = await fetchFrameworksAndDatabases(
      owner,
      repo,
      headers
    );

    // Read README.md content
    const readmeContent = await fetchFileContent(
      owner,
      repo,
      "README.md",
      headers
    );

    // Generate description
    const generatedDescription = generateDescription(
      data.description,
      readmeContent,
      frameworks,
      languages
    );

    return {
      name: data.name,
      description: generatedDescription,
      topics: data.topics || [],
      languages,
      frameworks,
      databases,
      owner: data.owner.login,
      repo,
      projectStructure: formatTree(treeData)
    };
  } catch (error) {
    console.error("Error fetching repo data:", error);
    toast.error("Failed to fetch repository data.");
    return null;
  }
}

// Fetch repository tree structure
async function fetchRepoTree(owner: string, repo: string, headers: any) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
      { headers }
    );
    return data.tree;
  } catch (error) {
    console.error("Error fetching repo tree:", error);
    return [];
  }
}

// Function to fetch repository languages
async function fetchLanguages(owner: string, repo: string, headers: any) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      { headers }
    );
    return Object.keys(data);
  } catch (error) {
    console.error("Error fetching languages:", error);
    return [];
  }
}

// Function to fetch package.json and infer frameworks & databases
async function fetchFrameworksAndDatabases(
  owner: string,
  repo: string,
  headers: any
) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/package.json`,
      { headers }
    );

    // Decode base64 package.json content
    const packageJson = JSON.parse(
      Buffer.from(data.content, "base64").toString("utf-8")
    );

    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    // Detect frameworks
    const frameworks = [];
    if (dependencies.react) frameworks.push("React");
    if (dependencies.next) frameworks.push("Next.js");
    if (dependencies.vue) frameworks.push("Vue.js");
    if (dependencies.nuxt) frameworks.push("Nuxt.js");
    if (dependencies.angular) frameworks.push("Angular");
    if (dependencies["express"]) frameworks.push("Express.js");
    if (dependencies["nestjs"]) frameworks.push("NestJS");
    if (dependencies["svelte"]) frameworks.push("Svelte");

    // Detect databases
    const databases = [];
    if (dependencies["mysql"]) databases.push("MySQL");
    if (dependencies["pg"]) databases.push("PostgreSQL");
    if (dependencies["mongodb"]) databases.push("MongoDB");
    if (dependencies["sequelize"]) databases.push("Sequelize (ORM)");
    if (dependencies["prisma"]) databases.push("Prisma (ORM)");
    if (dependencies["firebase"]) databases.push("Firebase");
    if (dependencies["redis"]) databases.push("Redis");

    return { frameworks, databases };
  } catch (error) {
    console.warn("Error fetching package.json:", error);
    return { frameworks: [], databases: [] };
  }
}

// Function to fetch file content
async function fetchFileContent(
  owner: string,
  repo: string,
  path: string,
  headers: any
) {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );
    return Buffer.from(data.content, "base64").toString("utf-8");
  } catch (error) {
    console.warn(`Error fetching file ${path}:`, error);
    return "";
  }
}

// Function to generate description
function generateDescription(
  repoDescription: string,
  readmeContent: string,
  frameworks: string[],
  languages: string[]
): string {
  if (repoDescription) return repoDescription;

  let description = "";

  if (readmeContent) {
    const firstParagraph = readmeContent.split("\n")[0];
    description += firstParagraph.length > 50 ? firstParagraph : "";
  }

  if (frameworks.length > 0) {
    description += ` Built with ${frameworks.join(", ")}.`;
  }

  if (languages.length > 0) {
    description += ` Written in ${languages.join(", ")}.`;
  }

  return description || "A brief description of the project.";
}

// Format repository files into a tree structure
function formatTree(tree: any[]) {
  const ignoredExtensions = [
    ".svg",
    ".png",
    ".jpg",
    ".gif",
    ".mjs",
    ".ico",
    ".mp3",
    ".mp4"
  ];
  const ignoredFiles = [
    "next.config.ts",
    "node_modules",
    "package-lock.json",
    "postcss.config.mjs",
    "tailwind.config.ts",
    "tsconfig.json",
    ".gitignore",
    "README.md",
    ".eslintrc.json",
    "vite.config.js",
    "eslint.config.js"
  ];

  let treeStructure: any = {};

  tree.forEach((item) => {
    const pathParts = item.path.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const fileExtension = fileName.includes(".")
      ? fileName.split(".").pop()
      : "";

    // Skip ignored files and extensions
    if (
      ignoredFiles.includes(fileName) ||
      ignoredExtensions.includes(`.${fileExtension}`)
    ) {
      return;
    }

    let current = treeStructure;
    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (!current[part]) {
        current[part] = i === pathParts.length - 1 ? null : {}; // Files get `null`, folders get objects
      }
      current = current[part];
    }
  });

  return formatTreeToString(treeStructure);
}

// Convert tree object to string
function formatTreeToString(tree: any, prefix = "") {
  let result = "";
  for (const key in tree) {
    result += `${prefix}├── ${key}\n`;
    if (tree[key] !== null) {
      result += formatTreeToString(tree[key], `${prefix}│   `);
    }
  }
  return result;
}
