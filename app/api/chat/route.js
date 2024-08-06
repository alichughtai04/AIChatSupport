import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
    // Initialize the Google Generative AI client with your API key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

    // Parse the incoming request to get the JSON data
    const data = await req.json();
    const { userPrompt } = data;

    // Define the system prompt
    const systemPrompt = `
        You are a helpful and knowledgeable customer service assistant for Headstarter, 
        an innovative platform that provides users with the opportunity to practice technical interviews 
        and receive real-time feedback. Your role is to assist users with any questions or issues 
        they may have regarding their interview practice sessions, account management, technical difficulties, 
        and general inquiries about the platform. Always respond in a friendly, professional, and supportive manner, 
        ensuring that users feel valued and confident in using Headstarter. Be concise, clear, and provide actionable 
        solutions or direct users to the appropriate resources.
    `;

    try {
        // Get the generative model instance
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Create a prompt combining the system prompt and user prompt
        const combinedPrompt = `${systemPrompt}\n\nUser Query: ${userPrompt}`;

        // Generate content stream based on the combined prompt
        const result = await model.generateContentStream(combinedPrompt);

        // Create a readable stream from the result
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of result.stream) {
                    const chunkText = await chunk.text();
                    controller.enqueue(chunkText);
                }
                controller.close();
            }
        });

        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    } catch (error) {
        console.error('Error with Google Generative AI API:', error);
        return NextResponse.json({ message: 'Error occurred', error: error.message }, { status: 200 });
    }
}
