import { DiagnosisResponse, AdvisoryResponse } from '@pmis/types';
import { geminiProvider } from './providers/gemini';
import { openrouterProvider } from './providers/openrouter';
import { groqProvider } from './providers/groq';
import { offlineProvider } from './providers/offline';

export type AIProvider = 'gemini' | 'openrouter' | 'groq' | 'offline';

export interface WaterfallConfig {
  geminiKey?: string;
  openRouterKey?: string;
  groqKey?: string;
}

export async function diagnoseWithWaterfall(
  prompt: string,
  config: WaterfallConfig
): Promise<DiagnosisResponse> {
  const providers = [
    { fn: geminiProvider, key: 'geminiKey', name: 'gemini' as AIProvider },
    { fn: openrouterProvider, key: 'openRouterKey', name: 'openrouter' as AIProvider },
    { fn: groqProvider, key: 'groqKey', name: 'groq' as AIProvider },
    { fn: offlineProvider, key: null, name: 'offline' as AIProvider },
  ];

  for (const provider of providers) {
    if (provider.key && !config[provider.key as keyof WaterfallConfig]) continue;
    try {
      const result = await provider.fn(prompt);
      if (result) return { ...result, provider: provider.name };
    } catch (err) {
      console.warn(`Provider ${provider.name} failed:`, err);
      continue;
    }
  }

  throw new Error('All AI providers failed');
}

export async function getAdvisoryWithWaterfall(
  prompt: string,
  config: WaterfallConfig
): Promise<AdvisoryResponse> {
  const providers = [
    { fn: geminiProvider, key: 'geminiKey', name: 'gemini' as AIProvider },
    { fn: openrouterProvider, key: 'openRouterKey', name: 'openrouter' as AIProvider },
    { fn: groqProvider, key: 'groqKey', name: 'groq' as AIProvider },
    { fn: offlineProvider, key: null, name: 'offline' as AIProvider },
  ];

  for (const provider of providers) {
    if (provider.key && !config[provider.key as keyof WaterfallConfig]) continue;
    try {
      const result = await provider.fn(prompt);
      if (result) return { ...result, provider: provider.name };
    } catch (err) {
      console.warn(`Provider ${provider.name} failed:`, err);
      continue;
    }
  }

  throw new Error('All AI providers failed');
}
