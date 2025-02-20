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
    readme += `## 🔧 Technologies Used\n${
      customContent.techStack ||
      (data.languages.length > 0
        ? "- " + data.languages.join("\n- ")
        : "- No languages detected.")
    }\n\n`;
  }

  if (sections.installation) {
    readme += `## 📦 Installation\n${
      customContent.installation ||
      `\`\`\`sh\ngit clone https://github.com/${data.owner}/${data.repo}.git\ncd ${data.repo}\nnpm install\n\`\`\`\n`
    }\n`;
  }

  return readme;
}
