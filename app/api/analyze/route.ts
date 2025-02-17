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

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: "Files content is required as a non-empty array of objects" },
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

    const prompt = `Can you analyze this repository and generate a professional README for it? Include:
    
    1. Project Title and Description
    2. Features
    3. Technologies Used
    4. Installation Instructions
    5. Usage Guide
    6. API Documentation (if applicable)
    7. License Information (if applicable)
    8. Project Type (e.g., Web Application, Mobile App)
    9. Thank You Note from Repository Owner
    
    Repository files:
    ${filesContent}
    
    Please generate the README.md in markdown format.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const readmeContent = response.text();

    if (!readmeContent) {
      throw new Error("No content generated from Gemini");
    }

    return NextResponse.json({ readme: readmeContent });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate README"
      },
      { status: 500 }
    );
  }
}
