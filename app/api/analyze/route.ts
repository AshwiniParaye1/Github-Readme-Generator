//api/analyze/route.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Validate environment variables
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { files } = await req.json();

    if (!files || !Array.isArray(files)) {
      return NextResponse.json(
        { error: "Files content is required as an array of objects" },
        { status: 400 }
      );
    }

    // Prepare the repository files content for the AI model
    const filesContent = files
      .map(
        (file: { name: string; content: string }) =>
          `File: ${file.name}\n\n${file.content}\n\n`
      )
      .join("\n");

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an expert developer tasked with creating a professional README.md file for a repository. 
    Analyze the following repository files and create a comprehensive README.md that includes:
    
    1. Project Title and Description
    2. Features
    3. Technologies Used
    4. Installation Instructions
    5. Usage Guide
    6. API Documentation (if applicable)
    7. Contributing Guidelines
    8. License Information
    
    Repository files:
    ${filesContent}
    
    Please generate a professional README.md in markdown format.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const readmeContent = response.text();

    if (!readmeContent) {
      throw new Error("No content generated from Gemini");
    }

    return NextResponse.json({ readme: readmeContent });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to generate README";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
