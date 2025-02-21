//utils/fetchRepoData.ts

import axios from "axios";

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

export async function fetchRepoData(repoUrl: string) {
  try {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) throw new Error("Invalid GitHub URL");

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

    return {
      name: data.name,
      description: data.description || "No description available.",
      topics: data.topics || [],
      languages: await fetchLanguages(owner, repo, headers),
      owner: data.owner.login,
      repo,
      projectStructure: formatTree(treeData)
    };
  } catch (error) {
    console.error("Error fetching repo data:", error);
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

// Fetch repository languages
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

// Format repository files into a tree structure
function formatTree(tree: any[]) {
  const ignoredExtensions = [".svg", ".png", ".jpg", ".gif", ".mjs", ".ico"];
  const ignoredFiles = [
    "next.config.ts",
    "package.json",
    "package-lock.json",
    "postcss.config.mjs",
    "tailwind.config.ts",
    "tsconfig.json",
    ".gitignore",
    "README.md",
    ".eslintrc.json"
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
