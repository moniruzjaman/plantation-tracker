interface ImportMetaEnv {
  readonly VITE_GEE_PIPELINE_URL?: string;
  readonly VITE_SENTINEL_HUB_INSTANCE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __GEMINI_API_KEY__?: string;
}
