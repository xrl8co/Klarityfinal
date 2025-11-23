import { GoogleGenAI } from "@google/genai";
import { Project, Currency } from "../types";

// Initialize the client safely
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeFinances = async (projects: Project[]): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    return "API Key não encontrada. Configure a variável de ambiente para usar recursos de IA.";
  }

  // Prepare data for the model
  const dataSummary = projects.map(p => ({
    projeto: p.name,
    orcamento: `${p.budget} ${p.currency}`,
    status: p.status,
    despesas: p.expenses.map(e => `${e.name}: ${e.amount} ${e.currency} (${e.category})`)
  }));

  const prompt = `
    Atue como um analista financeiro sênior (CFO) para uma empresa de gestão de projetos.
    Aqui estão os dados atuais dos nossos projetos em formato JSON:
    ${JSON.stringify(dataSummary)}

    Por favor, forneça uma análise estratégica breve e de alto nível em PORTUGUÊS (PT-BR).
    1. Identifique riscos potenciais (estouros de orçamento).
    2. Sugira oportunidades de economia de custos.
    3. Forneça um resumo executivo de 1 frase sobre a saúde do portfólio.
    
    Formate a saída como HTML (usando tags simples como <b>, <ul>, <li>, <p>) para ser renderizado diretamente dentro de uma div. Não use blocos de código Markdown. Mantenha o tom profissional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Nenhuma análise gerada.";
  } catch (error) {
    console.error("Falha na análise Gemini:", error);
    return "Ocorreu um erro ao analisar os dados financeiros.";
  }
};