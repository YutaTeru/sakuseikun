
import { GoogleGenAI } from "@google/genai";
import type { ResultData, AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analyzeImage = async (base64Image: string, mimeType: string): Promise<AnalysisResult> => {
    const model = 'gemini-2.5-pro';
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };
    const textPart = {
        text: `あなたは、日本の高校生の英語学習をサポートする、非常に優秀なAI英語講師です。提供された英語の試験問題の画像を分析し、以下のタスクを厳密に実行してください。

1.  **全文の抽出:** 画像内にあるすべての英語テキスト（長文、設問、選択肢など）を、改行を維持しながら正確に抽出してください。これを \`fullText\` に格納します。
2.  **長文の抽出:** 抽出した全文の中から、主要な長文読解の英文のみを抜き出してください。問題文や選択肢のテキストは含めないでください。これを \`extractedText\` に格納します。
3.  **問題形式の特定:** 画像に含まれる問題の種類を特定し、["scramble", "vocabulary", "grammar", "translation", "preposition", "reading_comprehension"] の中から該当するキーをすべて配列に含めてください。（ここで、\`reading_comprehension\`は、長文の内容理解を問う問題、例えば内容一致、主題選択、空所に文を補充する問題などを指します）。**もし問題が一切含まれていない場合は、必ず空の配列 \`[]\` を返してください。**
4.  **詳細な分析レポートの作成:** 以下の観点から、詳細な分析レポートを日本語で作成してください。
    *   **本文の構成:** 長文がどのような段落構成になっているか、各段落の要点を簡潔に説明してください。もし長文が存在しない場合は、「長文なし」と記述してください。
    *   **設問の形式:** どのような形式の問題が出題されているか（例：空欄補充、内容一致、同意表現選択など）。
    *   **問われている能力:** 各問題が受験生のどのような英語能力（語彙力、文法知識、読解力、文脈推測力など）を試しているか。
    *   **対策と学習アドバイス:** この形式の問題に慣れるために、どのような練習問題をこれから作成すれば効果的か、具体的なアドバイスを記述してください。

抽出した全文、長文、問題形式のキー配列、そして詳細な分析レポートを、以下のJSON形式で返してください。他のテキストは一切含めないでください。

{
  "fullText": "抽出した全文のテキスト...",
  "extractedText": "抽出した長文のテキスト...",
  "questionTypes": ["特定した問題形式のキーの配列..."],
  "analysisDetail": "ここに詳細な分析レポートを記述..."
}`
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
            }
        });
        const text = response.text;
        if (!text) {
            console.error("Gemini image analysis response is missing text.", response);
            throw new Error("AI response for image analysis was empty or blocked.");
        }
        const jsonText = text.trim();
        const parsedData: AnalysisResult = JSON.parse(jsonText);
        return parsedData;
    } catch (error) {
        console.error("Error analyzing image with Gemini:", error);
        throw new Error("Failed to parse analysis response from AI.");
    }
};

const analyzeText = async (text: string): Promise<AnalysisResult> => {
    const model = 'gemini-2.5-pro';
    const prompt = `あなたは、日本の高校生の英語学習をサポートする、非常に優秀なAI英語講師です。以下の「試験問題のテキスト」を分析し、以下のタスクを厳密に実行してください。

1.  **長文の抽出:** テキストの中から、主要な長文読解の英文をすべて正確に抽出してください。問題文や選択肢のテキストは含めないでください。もし、長文が見当たらない場合は、テキスト全体をそのまま返してください。
2.  **問題形式の特定:** テキストに含まれる問題の種類を特定し、["scramble", "vocabulary", "grammar", "translation", "preposition", "reading_comprehension"] の中から該当するキーをすべて配列に含めてください。（ここで、\`reading_comprehension\`は、長文の内容理解を問う問題、例えば内容一致、主題選択、空所に文を補充する問題などを指します）。**もし問題が一切含まれていない場合は、必ず空の配列 \`[]\` を返してください。**
3.  **詳細な分析レポートの作成:** 以下の観点から、詳細な分析レポートを日本語で作成してください。
    *   **本文の構成:** 長文がどのような段落構成になっているか、各段落の要点を簡潔に説明してください。もし長文が存在しない場合は、「長文なし」と記述してください。
    *   **設問の形式:** どのような形式の問題が出題されているか（例：空欄補充、内容一致、同意表現選択など）。
    *   **問われている能力:** 各問題が受験生のどのような英語能力（語彙力、文法知識、読解力、文脈推測力など）を試しているか。
    *   **対策と学習アドバイス:** この形式の問題に慣れるために、どのような練習問題をこれから作成すれば効果的か、具体的なアドバイスを記述してください。

抽出した長文、問題形式のキー配列、詳細な分析レポート、そして入力された全文を、以下のJSON形式で返してください。他のテキストは一切含めないでください。

{
  "fullText": "ここには、下の「試験問題のテキスト」の内容をそのままコピーしてください。",
  "extractedText": "抽出した長文のテキスト...",
  "questionTypes": ["特定した問題形式のキーの配列..."],
  "analysisDetail": "ここに詳細な分析レポートを記述..."
}

# 試験問題のテキスト
\`\`\`
${text}
\`\`\`
`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        const text = response.text;
        if (!text) {
            console.error("Gemini text analysis response is missing text.", response);
            throw new Error("AI response for text analysis was empty or blocked.");
        }
        const jsonText = text.trim();
        const parsedData: AnalysisResult = JSON.parse(jsonText);
        return parsedData;
    } catch (error) {
        console.error("Error analyzing text with Gemini:", error);
        throw new Error("Failed to parse analysis response from AI.");
    }
};


const buildPrompt = (passage: string, theme: string, creativity: number, themeStrength: number, nicheLevel: number, questionTypes: string[], analysisDetail: string): string => {
  return `
あなたは、日本の高校生の英語学習をサポートする、創造的で優秀なAIアシスタントです。
これから提供される「元の英文」「テーマ」「各種パラメータ」「分析レポート」の情報を使って、以下の2つを同時に生成してください。

1. 全く新しい面白い長文（一文ずつの日本語訳付き）
2. 生成した長文を題材にした英語の試験問題（解答・解説付き）

# 守るべきルール

## 1. 長文生成ルール
*   **元の英文の分析:** 「元の英文」を分析し、主要な英単語や文法の難易度（高校基礎〜標準レベル）を把握してください。
*   **各種パラメータの適用:**
    *   **創造性レベル:**
        *   0に近いほど、「元の英文」で使われている単語を最優先で再利用してください。
        *   50に近いほど、「元の英文」の単語の再利用と、「テーマ」への忠実さのバランスを取ってください。
        *   100に近いほど、「テーマ」に忠実な物語を作ることを最優先してください。
    *   **テーマの反映度:**
        *   0に近いほど、テーマは物語の背景的な要素として控えめに扱ってください。
        *   100に近いほど、テーマが物語のプロットの中心となるように、全面的に扱ってください。
    *   **専門性/マニア度:**
        *   0に近いほど、テーマに関連する語彙は一般的で誰にでも理解できるものを使用してください。
        *   100に近いほど、そのテーマの専門家やマニアが喜ぶような、専門的でニッチな単語や概念を積極的に取り入れてください。
*   **新しい物語の生成:**
    *   「テーマ」に沿った、面白くて一貫性のある物語を作成してください。
    *   物語の長さと難易度は、「元の英文」と同程度にしてください。
    *   段落構成も「元の英文」を参考にし、生成する物語に反映させてください。
    *   物語は段落ごと、さらに文ごとに分解し、それぞれに自然で分かりやすい日本語訳を付けてください。

## 2. 英語問題生成ルール
*   **分析レポートの考慮:** 以下の「分析レポート」を熟読し、そこで指摘されている設問の形式、難易度、問われている能力を深く理解してください。
*   **問題の生成:**
    *   **あなたが上で生成した長文のみ**を題材としてください。
    *   元の問題と**寸分違わぬ形式とスタイル**で、同数の問題を作成してください。例えば、元の問題が空欄補充の4択問題であれば、全く同じ形式で問題を作成します。元の問題が内容合致問題であれば、同様に内容合致問題を作成します。
    *   **問題のカテゴリ分けは絶対にしないでください。** すべての問題を単一のフラットな配列に格納してください。
*   **難易度:** 問題の難易度は、生成した長文のレベルに合わせてください。

## 3. ユーザーからのインプット
*   **元の英文:**
\`\`\`
${passage}
\`\`\`
*   **テーマ:** ${theme}
*   **各種パラメータ:**
    *   **創造性レベル:** ${creativity}
    *   **テーマの反映度:** ${themeStrength}
    *   **専門性/マニア度:** ${nicheLevel}
*   **分析レポート:**
\`\`\`
${analysisDetail}
\`\`\`

## 4. 出力形式
*   最終的な出力は、以下のJSON形式に厳密に従ってください。解説など、他のテキストは一切含めないでください。

\`\`\`json
{
  "story": [
    [
      {
        "english": "This is the first sentence of the first paragraph.",
        "japanese": "これは最初の段落の最初の文です。"
      },
      {
        "english": "This is the second sentence.",
        "japanese": "これが二番目の文です。"
      }
    ],
    [
      {
        "english": "This is a new paragraph.",
        "japanese": "これは新しい段落です。"
      }
    ]
  ],
  "questions": [
    {
      "id": 1,
      "question_text": "文中の空欄を埋めるのに最も適切なものを選びなさい: 'The hero faced a ___ challenge.'",
      "options": ["A. tiny", "B. formidable", "C. easy", "D. simple"],
      "answer": "B. formidable",
      "explanation": "なぜその単語が文脈に合うのかの簡潔な解説"
    },
    {
      "id": 2,
      "question_text": "According to the story, why did the robot decide to leave the planet?",
      "options": [
        "A. Because it was malfunctioning.",
        "B. To search for its creator.",
        "C. It was exiled by the other robots.",
        "D. It wanted to explore the galaxy."
      ],
      "answer": "B. To search for its creator.",
      "explanation": "本文の第3段落に「... a quest to find its long-lost creator.」とあるため、Bが正解です。"
    },
    {
      "id": 3,
      "question_text": "以下の下線部を日本語に訳しなさい。\\n'The technology has evolved in unexpected ways.'",
      "options": [],
      "answer": "その技術は予期せぬ形で進化してきた。",
      "explanation": "evolveやunexpected waysなどの重要語句の解説"
    }
  ]
}
\`\`\`
`;
};

const generateContent = async (
  passage: string,
  theme: string,
  creativity: number,
  themeStrength: number,
  nicheLevel: number,
  questionTypes: string[],
  isHighAccuracyMode: boolean,
  analysisDetail: string
): Promise<ResultData> => {
  const model = "gemini-2.5-pro";
  const prompt = buildPrompt(passage, theme, creativity, themeStrength, nicheLevel, questionTypes, analysisDetail);

  const config: any = {
    responseMimeType: "application/json",
  };

  if (isHighAccuracyMode) {
    config.thinkingConfig = { thinkingBudget: 32768 }; // Max budget for gemini-2.5-pro
  }

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: config
    });
    const text = response.text;
    if (!text) {
        console.error("Gemini content generation response is missing text.", response);
        throw new Error("AI response for content generation was empty or blocked.");
    }
    const jsonText = text.trim();
    const parsedData: ResultData = JSON.parse(jsonText);
    return parsedData;
  } catch (error) {
    console.error("Error generating content from Gemini:", error);
    throw new Error("Failed to parse response from AI. The format might be incorrect.");
  }
};

export const geminiService = {
  generateContent,
  analyzeImage,
  analyzeText,
};
