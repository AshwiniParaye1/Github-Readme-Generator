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
    const { repoUrl } = await req.json();

    if (!repoUrl || typeof repoUrl !== "string") {
      return NextResponse.json(
        { error: "GitHub repository URL is required" },
        { status: 400 }
      );
    }

    // Prepare the prompt
    const prompt = `Can you analyze the GitHub repository at ${repoUrl} and generate a professional README for it? Include project Description, Features, Technologies Used Installation Instructions, usage and a Thank You Note from Repository Owner:

    Please generate the README.md in markdown format.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
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
