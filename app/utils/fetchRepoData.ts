//utils/fetchRepoData.ts

import axios from "axios";

export async function fetchRepoData(repoUrl: string) {
  try {
    const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) throw new Error("Invalid GitHub URL");

    const [, owner, repo] = match;

    // Fetch repository details
    const { data } = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`
    );

    // Fetch repository topics (as features)
    const topicsResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/topics`,
      {
        headers: { Accept: "application/vnd.github.mercy-preview+json" }
      }
    );

    // Fetch languages used
    const languagesResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/languages`
    );

    return {
      name: data.name,
      description: data.description || "No description available.",
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language || "Not specified",
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
