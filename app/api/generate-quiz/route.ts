import { createGroq } from "@ai-sdk/groq"
import { generateText } from "ai"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { lessonTitle, lessonContent } = await request.json()
    const timestamp = Date.now()

    console.log("[v0] Generating quiz for:", lessonTitle)

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `You are a quiz generator. Create a unique educational quiz about vaping.

Lesson: ${lessonTitle}

Content:
${lessonContent}

Generate EXACTLY 5 multiple-choice questions. Each question must have EXACTLY 4 answer options.

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Explanation of why this answer is correct"
    }
  ]
}

Requirements:
- correctAnswer must be 0, 1, 2, or 3 (the index of the correct option)
- Use varied question types (recall, comprehension, application, scenario-based)
- Make questions unique - vary wording, focus areas, and answer order
- Focus on different aspects of the content each time
- Create unique answer choices

Quiz ID: ${timestamp}

Respond with ONLY the JSON, no other text.`,
    })

    console.log("[v0] Raw AI response:", text.substring(0, 200))

    // Parse and validate the response
    let parsed
    try {
      // Remove any markdown code blocks if present
      const cleanedText = text
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      parsed = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      console.error("[v0] Failed to parse:", text)
      throw new Error("Invalid JSON response from AI")
    }

    // Validate the structure
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Response missing questions array")
    }

    if (parsed.questions.length !== 5) {
      console.warn("[v0] Expected 5 questions, got", parsed.questions.length)
      // Trim or pad to exactly 5 questions
      if (parsed.questions.length > 5) {
        parsed.questions = parsed.questions.slice(0, 5)
      } else {
        throw new Error(`Only ${parsed.questions.length} questions generated`)
      }
    }

    // Validate each question
    for (let i = 0; i < parsed.questions.length; i++) {
      const q = parsed.questions[i]
      if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${i + 1} has invalid structure`)
      }
      if (typeof q.correctAnswer !== "number" || q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(`Question ${i + 1} has invalid correctAnswer`)
      }
      if (!q.explanation) {
        throw new Error(`Question ${i + 1} missing explanation`)
      }
    }

    console.log("[v0] Quiz validated successfully with", parsed.questions.length, "questions")
    return Response.json(parsed)
  } catch (error) {
    console.error("[v0] Quiz generation error:", error)
    return Response.json({ error: error instanceof Error ? error.message : "Failed to generate quiz" }, { status: 500 })
  }
}
