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

    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );
    const topicsResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/topics`,
      {
        headers: {
          ...headers,
          Accept: "application/vnd.github.mercy-preview+json"
        }
      }
    );

    const languagesResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/languages`,
      { headers }
    );

    return {
      name: data.name,
      description: data.description || "No description available.",
      topics: topicsResponse.data.names || [],
      languages: Object.keys(languagesResponse.data),
      owner: data.owner.login,
      repo: repo
    };
  } catch (error) {
    console.error("Error fetching repo data:", error);
    return null;
  }
}
