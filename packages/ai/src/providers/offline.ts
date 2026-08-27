export async function offlineProvider(prompt: string): Promise<any> {
  // Simple rule-based fallback for offline mode
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('disease') || lowerPrompt.includes('pest')) {
    return {
      text: 'Based on the symptoms described, this may be a common fungal or pest issue. Please consult with an agricultural expert for accurate diagnosis. Ensure proper ventilation and avoid overwatering.',
      raw: null
    };
  }
  
  if (lowerPrompt.includes('fertilizer') || lowerPrompt.includes('nutrient')) {
    return {
      text: 'For general crop health, consider applying balanced NPK fertilizer based on soil test results. Organic compost can also improve soil health.',
      raw: null
    };
  }
  
  if (lowerPrompt.includes('water') || lowerPrompt.includes('irrigation')) {
    return {
      text: 'Check soil moisture before watering. Drip irrigation is recommended for water efficiency. Water early morning or late evening to reduce evaporation.',
      raw: null
    };
  }
  
  return {
    text: 'General advice: Monitor crop health regularly, maintain proper spacing, and follow integrated pest management practices.',
    raw: null
  };
}
