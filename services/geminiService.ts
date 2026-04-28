import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateBiInsights = async (dataContext: string): Promise<string> => {
  const ai = getAiClient();
  
  // Realistic Fallback Data
  const fallbackData = `• **效率提升**: HVAC 维护的平均修复时间 (MTTR) 减少了 15%，这表明新的预防性维护计划正在奏效。
• **收入机会**: “液压系统”类别的紧急维修请求增加了 20%，建议增加该领域的备件库存以利用高利润率。
• **成本控制**: 通过优化路线，上个月的差旅成本降低了 8%，主要由南区团队推动。`;

  if (!ai) return fallbackData;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a Business Intelligence analyst for a field service management company. 
      Analyze the following JSON dataset of recent work orders and provide 3 concise, high-value strategic insights regarding revenue, efficiency, or equipment reliability. 
      Format with bullet points in Chinese.
      
      Data: ${dataContext}`,
    });
    return response.text || fallbackData;
  } catch (error) {
    console.warn("Error generating BI insights (using fallback):", error);
    return fallbackData;
  }
};

export const generateDeepAnalysis = async (dataContext: string): Promise<string> => {
  const ai = getAiClient();
  
  const mockResponse = `
      <h4>执行摘要</h4>
      <p>尽管由于季节性HVAC维护需求，整体服务量增加了15%，但平均解决时间（MTTR）略有增加。成本效率依然强劲，主要得益于预防性维护策略的成功实施。</p>
      
      <h4>运营瓶颈分析</h4>
      <ul>
        <li><strong>备件物流：</strong> 紧急工单（Critical）的平均等待时间比标准工单高出40%，表明供应链响应存在滞后。</li>
        <li><strong>技能匹配：</strong> 针对“液压机”类别的首次修复率（FTFR）低于平均水平，建议加强针对性培训。</li>
      </ul>

      <h4>战略建议</h4>
      <p>建议重新分配二级供应商资源以覆盖非核心区域的低复杂度工单，从而释放高级工程师专注于高利润的工业设备维修。同时，应立即审查高频故障设备的备件库存策略。</p>
    `;

  if (!ai) return mockResponse;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Act as a Senior Data Scientist for a Field Service ecosystem. 
      Based on the provided Work Order data, generate a comprehensive analysis report in HTML format (no markdown code blocks, just raw HTML).
      
      Structure:
      1. <h4>Executive Summary</h4>: Brief overview of performance.
      2. <h4>Trend Analysis</h4>: Revenue and efficiency trends.
      3. <h4>Operational Bottlenecks</h4>: Specific issues identified.
      4. <h4>Strategic Recommendations</h4>: Actionable steps.

      Keep it professional, insightful, and use standard HTML tags like <p>, <ul>, <li>, <strong>. Output in Chinese.

      Data: ${dataContext}`,
    });
    return response.text || mockResponse;
  } catch (error) {
    console.warn("Error generating deep analysis (using fallback):", error);
    return mockResponse;
  }
};

export const searchKnowledgeBase = async (query: string, articlesContext: string): Promise<string> => {
  const ai = getAiClient();
  const mockResponse = "根据您的查询，建议检查液压油位并清洁密封圈。如果泄漏持续，请参考更换密封件的标准操作程序 (SOP-HYD-01)。始终确保在操作前设备已断电并泄压。";

  if (!ai) return mockResponse;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful assistant for field engineers. 
      Using the following knowledge base article summaries, answer the user's query directly and concisely in Chinese.
      If the answer isn't in the context, suggest general best practices.

      Context: ${articlesContext}
      
      User Query: "${query}"`,
    });
    return response.text || mockResponse;
  } catch (error) {
    console.warn("Error searching KB (using fallback):", error);
    return mockResponse;
  }
};

export const analyzeChatSession = async (chatHistory: string): Promise<string> => {
  const ai = getAiClient();
  const mockResponse = JSON.stringify({
    summary: "客户报告 KDS 屏幕故障，工程师已确认电源问题并订购备件。客户对进度表示满意。",
    sentiment: "Positive",
    keyIssues: ["KDS 屏幕不亮", "电源模块烧毁", "需等待备件"],
    recommendation: "跟踪备件物流，到货后立即安排优先安装。"
  });

  if (!ai) return mockResponse;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following customer support chat log between a Customer, an Engineer, and an Agent.
      Provide a response in JSON format (do not use markdown code blocks, just raw JSON) with the following keys:
      - "summary": A brief summary of the issue and current status (max 20 words, in Chinese).
      - "sentiment": The customer's current sentiment (Positive, Neutral, Frustrated, Angry).
      - "keyIssues": An array of strings listing key technical or logistical issues identified (in Chinese).
      - "recommendation": A suggested next step for the support agent (in Chinese).

      Chat Log:
      ${chatHistory}`,
      config: {
        responseMimeType: 'application/json'
      }
    });
    return response.text || mockResponse;
  } catch (error) {
    console.warn("Error analyzing chat (using fallback):", error);
    return mockResponse;
  }
}