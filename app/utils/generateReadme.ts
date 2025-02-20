//utils/generateReadme.ts

export function generateReadme(data: any) {
  if (!data) return "";

  return `# ${data.name}
    
    🖥️ **Language:** ${data.language}  
    
    ## 📝 Description
    ${data.description}
    
    ## ✨ Features
    ${
      data.topics.length > 0
        ? data.topics.map((topic: string) => `- ${topic}`).join("\n")
        : "- No specific features mentioned."
    }
    
    ## 🔧 Technologies Used
    ${
      data.languages.length > 0
        ? data.languages.map((lang: string) => `- ${lang}`).join("\n")
        : "- No languages detected."
    }
    
    ## 📦 Installation
    \`\`\`sh
    git clone https://github.com/${data.owner}/${data.repo}.git
    cd ${data.repo}
    npm install
    \`\`\`
    
    ## 🚀 Usage
    \`\`\`sh
    npm start
    \`\`\`
    
    ## 🎉 Thank You
    Thank you for checking out this project! Feel free to contribute or reach out with feedback.
      `;
}
