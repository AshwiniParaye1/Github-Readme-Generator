// utils/generateReadme.ts
interface CodeAnalysis {
  features: string[];
  setupSteps: string[];
  dependencies: string[];
}

function analyzeCode(files: any[]): CodeAnalysis {
  const features: Set<string> = new Set();
  const setupSteps: Set<string> = new Set();
  const dependencies: Set<string> = new Set();

  files.forEach((file) => {
    // Detect features from imports and major code patterns
    const importMatches = file.content.match(
      /import\s+.*\s+from\s+['"](.+)['"]/g
    );
    if (importMatches) {
      importMatches.forEach((match: string) => {
        const lib = match.split("from")[1].replace(/['"]/g, "").trim();
        if (!lib.startsWith(".")) {
          dependencies.add(lib);
        }
      });
    }

    // Detect API routes
    if (file.content.includes("api/")) {
      features.add("REST API endpoints");
    }

    // Detect database usage
    if (
      file.content.includes("mongoose") ||
      file.content.includes("sequelize")
    ) {
      features.add("Database integration");
    }

    // Detect authentication
    if (file.content.includes("auth") || file.content.includes("jwt")) {
      features.add("Authentication system");
    }

    // Detect frontend frameworks
    if (file.content.includes("react")) {
      features.add("React-based UI");
    }
    if (file.content.includes("vue")) {
      features.add("Vue.js integration");
    }
  });

  return {
    features: Array.from(features),
    setupSteps: Array.from(setupSteps),
    dependencies: Array.from(dependencies)
  };
}

export function generateReadme(data: any) {
  if (!data) return "";

  const codeAnalysis = analyzeCode(data.files);

  // Generate installation steps based on package.json
  const installSteps = [
    "git clone https://github.com/" + data.owner + "/" + data.repo
  ];
  if (Object.keys(data.dependencies).length > 0) {
    installSteps.push("npm install");
  }
  if (data.scripts.start) {
    installSteps.push("npm start");
  }

  return `# ${data.name}

${data.description}

${
  data.stars > 0
    ? `![GitHub stars](https://img.shields.io/github/stars/${data.owner}/${data.repo})`
    : ""
}
${
  data.forks > 0
    ? `![GitHub forks](https://img.shields.io/github/forks/${data.owner}/${data.repo})`
    : ""
}

## Features

${codeAnalysis.features.map((feature) => `- ${feature}`).join("\n")}
${data.topics.map((topic: any) => `- ${topic}`).join("\n")}

## Tech Stack

${data.languages.map((lang: any) => `- ${lang}`).join("\n")}

## Dependencies

${Object.keys(data.dependencies)
  .map((dep) => `- ${dep}`)
  .join("\n")}

## Installation

\`\`\`bash
${installSteps.join("\n")}
\`\`\`

${data.scripts.test ? `## Testing\n\n\`\`\`bash\nnpm test\n\`\`\`\n` : ""}

## Available Scripts

${Object.entries(data.scripts)
  .map(([name, script]) => `- \`${name}\`: ${script}`)
  .join("\n")}

## Project Structure

\`\`\`
${data.files.map((file: any) => file.path).join("\n")}
\`\`\`

## Contributing

1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
`;
}
