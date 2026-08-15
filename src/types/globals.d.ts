declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }

  interface Window {
    Capacitor?: {
      isNativePlatform?: () => boolean;
      Plugins?: Record<string, any>;
    } | any;
    deferredPrompt?: BeforeInstallPromptEvent | null;
  }

  interface Navigator {
    standalone?: boolean;
  }
}

export {};
