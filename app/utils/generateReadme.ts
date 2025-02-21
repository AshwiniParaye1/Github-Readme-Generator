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

  if (sections.features) {
    readme += `## ✨ Features\n${
      customContent.features ||
      (data.topics.length > 0
        ? "- " + data.topics.join("\n- ")
        : "List your project's features here.")
    }\n\n`;
  }

  if (sections.techStack) {
    const techStack = [
      ...(data.languages || []),
      ...(data.frameworks || []),
      ...(data.databases || [])
    ];

    readme += `## 🔧 Technologies Used\n`;
    readme +=
      customContent.techStack ||
      (techStack.length > 0
        ? "- " + techStack.join("\n- ")
        : "No technologies detected.");
    readme += "\n\n";
  }

  if (sections.installation) {
    readme += `## 📦 Installation\n${
      customContent.installation ||
      `\`\`\`sh\ngit clone https://github.com/${data.owner}/${data.repo}.git\ncd ${data.repo}\nnpm install\n\`\`\``
    }\n`;
  }

  if (sections.projectStructure) {
    readme += `## 📂 Project Structure\n\`\`\`\n${
      customContent.projectStructure ||
      data.projectStructure ||
      "Project structure not available."
    }\n\`\`\`\n\n`;
  }

  if (sections.howToUse) {
    readme += `## 🚀 How to Use\n${
      customContent.howToUse ||
      data.howToUse ||
      "Instructions on how to use the project."
    }\n\n`;
  }

  if (sections.contribution) {
    readme += `## 🤝 Contribution\n${
      customContent.contribution ||
      "Contributions are welcome! Please open an issue or submit a pull request."
    }\n\n`;
  }

  if (sections.license) {
    readme += `## 📜 License\n${
      customContent.license ||
      "This project is licensed under the MIT License - see the LICENSE file for details."
    }\n\n`;
  }

  readme += `---
  
  Thank you for checking out ${
    customContent.title || data.name
  }! If you find it useful, consider giving it a star on GitHub!  
  \n`;

  return readme;
}
