import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import OpenAI from "openai";
import prisma from "@/lib/db";

// Initialize OpenAI client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();

    // Generate blog post content
    const contentResult = await generateText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that writes blog posts.",
        },
        {
          role: "user",
          content: `Write a blog post with the title "${title}" and based on this description: "${description}". The blog post should be around 500 words.`,
        },
      ],
    });

    const content = await contentResult.text;

    // Generate image using DALL-E 3
    const imageResponse = await openaiClient.images.generate({
      model: "dall-e-3",
      prompt: `Create an image for a blog post titled "${title}" with the following description: "${description}"`,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = imageResponse.data[0].url;
    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }

    // Save the post to the database
    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
