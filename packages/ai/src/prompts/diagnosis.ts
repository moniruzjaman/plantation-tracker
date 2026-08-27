export const DIAGNOSIS_PROMPT_BN = `
আপনি একজন কৃষি বিশেষজ্ঞ। নিম্নলিখিত লক্ষণ এবং পছকের তথ্য থেকে রোগ বা পোকaign Diagnosis করুন।

লক্ষণ: {symptoms}
পশম: {cropType}
উদ্ভিদ পর্যায়: {cropStage}
অবস্থান: {location}

বাংলায় উত্তর দিন:
1. সম্ভাব্য রোগ/পোকার নাম
2. আত্মবিশ্বাস স্তর (০-১০০%)
3. চিকিৎসা পরামর্শ
4. প্রতিরোধের উপায়
`;

export const DIAGNOSIS_PROMPT_EN = `
You are an agricultural expert. Based on the following symptoms and crop information, provide a diagnosis.

Symptoms: {symptoms}
Crop: {cropType}
Growth Stage: {cropStage}
Location: {location}

Respond in English:
1. Likely disease/pest name
2. Confidence level (0-100%)
3. Treatment recommendations
4. Prevention measures
`;

export function buildDiagnosisPrompt(symptoms: string[], cropType: string, cropStage: string, location: string, language: 'bn' | 'en' = 'bn'): string {
  const template = language === 'bn' ? DIAGNOSIS_PROMPT_BN : DIAGNOSIS_PROMPT_EN;
  return template
    .replace('{symptoms}', symptoms.join(', '))
    .replace('{cropType}', cropType)
    .replace('{cropStage}', cropStage)
    .replace('{location}', location);
}
