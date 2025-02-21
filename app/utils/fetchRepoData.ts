//utils/fetchRepoData.ts

import axios from "axios";

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

// Function to fetch repository data
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

    // Fetch languages
    const languages = await fetchLanguages(owner, repo, headers);

    // Fetch package.json to detect frameworks & databases
    const { frameworks, databases } = await fetchFrameworksAndDatabases(
      owner,
      repo,
      headers
    );

    return {
      name: data.name,
      description: data.description || "No description available.",
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
    return null;
  }
}

// Function to fetch repository tree structure
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
    console.error("Error fetching package.json:", error);
    return { frameworks: [], databases: [] };
  }
}

// Function to format repository tree
function formatTree(tree: any[]) {
  const ignoredExtensions = [".svg", ".png", ".jpg", ".gif", ".mjs", ".ico"];
  const ignoredFiles = [
    "next.config.ts",
    "node_modules",
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
        current[part] = i === pathParts.length - 1 ? null : {};
      }
      current = current[part];
    }
  });

  return formatTreeToString(treeStructure);
}

// Function to convert tree object to string
function formatTreeToString(tree: any, prefix = "") {
  let result = "";
  for (const key in tree) {
    result += `${prefix}├── ${key}\n`;
    if (tree[key] !== null) {
      result += formatTreeToString(tree[key], `${prefix}│   `);
    }
  }
  return result.trim();
}
