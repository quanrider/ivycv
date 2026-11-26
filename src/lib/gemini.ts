export interface GeminiCallInput {
  apiKey: string;
  model: string;
  systemInstruction: string;
  userPrompt: string;
}

export async function callGeminiJson(
  input: GeminiCallInput
): Promise<Record<string, unknown>> {
  const { apiKey, model, systemInstruction, userPrompt } = input;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    }),
  });

  if (!response.ok) {
    const status = response.status;
    if (status === 401 || status === 403) {
      throw new Error('API key Gemini không hợp lệ hoặc không có quyền truy cập.');
    }
    throw new Error(`Gemini API trả về lỗi (${status}).`);
  }

  const payload = (await response.json()) as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
  };

  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!text.trim()) {
    throw new Error('AI không trả về nội dung phản hồi.');
  }

  const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/i, '').trim();
  try {
    return JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    return {
      summary: cleaned,
      suggestions: [cleaned],
      explanation: 'Phản hồi dạng văn bản từ AI.',
    };
  }
}
