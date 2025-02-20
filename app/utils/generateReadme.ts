//utils/generateReadme.ts

export function generateReadme(
  data: any,
  sections: Record<string, boolean>,
  customContent: Record<string, string>
) {
  if (!data) return "";

  let readme = "";

  if (sections.title) {
    readme += `# ${customContent.title || data.name}\n\n`;
  }

  if (sections.description) {
    readme += `## 📝 Description\n${
      customContent.description || data.description
    }\n\n`;
  }

  if (sections.features && data.topics.length > 0) {
    readme += `## ✨ Features\n${
      customContent.features ||
      data.topics.map((topic: string) => `- ${topic}`).join("\n")
    }\n\n`;
  }

  if (sections.techStack) {
    readme += `## 🔧 Technologies Used\n${
      customContent.techStack ||
      (data.languages.length > 0
        ? data.languages.map((lang: string) => `- ${lang}`).join("\n")
        : "- No languages detected.")
    }\n\n`;
  }

  if (sections.installation) {
    readme += `## 📦 Installation\n${
      customContent.installation ||
      `\`\`\`sh
git clone https://github.com/${data.owner}/${data.repo}.git
cd ${data.repo}
npm install
\`\`\`\n`
    }\n`;
  }

  if (sections.projectStructure) {
    readme += `## 📁 Project Structure\n${
      customContent.projectStructure || "Add your project structure here."
    }\n\n`;
  }

  if (sections.apiStructure) {
    readme += `## 🌐 API Structure\n${
      customContent.apiStructure || "Add your API structure here."
    }\n\n`;
  }

  if (sections.contribution) {
    readme += `## 🤝 Contribution\n${
      customContent.contribution ||
      "Guidelines for contributing to the project."
    }\n\n`;
  }

  if (sections.license) {
    readme += `## 📄 License\n${
      customContent.license || "This project is licensed under the MIT License."
    }\n\n\t`;
  }

  readme += `Thank you for checking out this project! Feel free to contribute or reach out with feedback.\n`;

  return readme;
}
