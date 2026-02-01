import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ActionResult {
  stats: {
    STR: number;
    INT: number;
    VIT: number;
    DEX: number;
    LUK: number;
  };
  comment: string;
}

export async function evaluateAction(text: string): Promise<ActionResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `너는 현실 행동을 RPG 스탯(STR, INT, VIT, DEX, LUK) 경험치로 변환하는 시스템 관리자다.

규칙:
1. 입력된 행동을 분석해 각 스탯의 변동치(정수)를 계산한다.
2. 스탯 변동 기준:
   - STR (근력): 운동, 육체 활동, 힘쓰는 일
   - INT (지능): 공부, 독서, 논리적 사고, 문제 해결
   - VIT (체력): 건강 관리, 수면, 영양 섭취, 휴식
   - DEX (민첩): 손재주, 타이핑, 악기 연주, 세밀한 작업
   - LUK (행운): 새로운 시도, 도전, 긍정적 마인드
3. 변동치는 행동의 강도와 지속시간에 비례한다. (보통 0~5 범위)
4. 긍정적 행동은 +, 부정적 행동은 - 로 처리한다.
5. 한 줄 코멘트를 작성해 사용자를 격려하거나 조언한다.

**중요: 응답은 반드시 아래 형식의 순수한 JSON 문자열이어야 한다. Markdown 코드블록이나 backtick을 사용하지 말 것.**

출력 형식:
{"stats":{"STR":0,"INT":0,"VIT":0,"DEX":0,"LUK":0},"comment":"코멘트 내용"}

사용자의 행동:
${text}`;

  const result = await model.generateContent(prompt);
  const response = result.response.text().trim();

  // Remove markdown code blocks if present
  let cleanedResponse = response;
  if (response.startsWith("```")) {
    cleanedResponse = response
      .replace(/```json?\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
  }

  try {
    const parsed = JSON.parse(cleanedResponse);
    return parsed;
  } catch (error) {
    console.error("Failed to parse Gemini response:", cleanedResponse);
    throw new Error("Invalid response format from AI");
  }
}
