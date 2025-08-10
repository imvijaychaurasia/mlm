export interface AppConfig {
  appName: string;
  useMocks: boolean;
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  razorpay: {
    keyId: string;
  };
  geo: {
    provider: 'none' | 'mock' | 'geofire' | 'google';
  };
}

export const getEnvConfig = (): AppConfig => {
  const config: AppConfig = {
    appName: import.meta.env.VITE_APP_NAME || 'Mera Local Market',
    useMocks: import.meta.env.VITE_USE_MOCKS === 'true',
    firebase: {
      apiKey: import.meta.env.VITE_FB_API_KEY || '',
      authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN || '',
      projectId: import.meta.env.VITE_FB_PROJECT_ID || '',
      storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FB_APP_ID || '',
    },
    razorpay: {
      keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
    },
    geo: {
      provider: (import.meta.env.VITE_MAPS_PROVIDER as any) || 'mock',
    },
  };

  return config;
};

export const isMockMode = (): boolean => {
  const config = getEnvConfig();
  return config.useMocks;
};

export interface ProviderValidation {
  name: string;
  keys: { key: string; present: boolean; value?: string }[];
  isValid: boolean;
}

export const validateEnvironment = (): {
  isValid: boolean;
  issues: string[];
  config: AppConfig;
  providers: ProviderValidation[];
} => {
  const config = getEnvConfig();
  const issues: string[] = [];

  const providers: ProviderValidation[] = [
    {
      name: 'Firebase',
      keys: [
        { key: 'VITE_FB_API_KEY', present: !!config.firebase.apiKey, value: config.firebase.apiKey },
        { key: 'VITE_FB_AUTH_DOMAIN', present: !!config.firebase.authDomain, value: config.firebase.authDomain },
        { key: 'VITE_FB_PROJECT_ID', present: !!config.firebase.projectId, value: config.firebase.projectId },
        { key: 'VITE_FB_STORAGE_BUCKET', present: !!config.firebase.storageBucket, value: config.firebase.storageBucket },
        { key: 'VITE_FB_MESSAGING_SENDER_ID', present: !!config.firebase.messagingSenderId, value: config.firebase.messagingSenderId },
        { key: 'VITE_FB_APP_ID', present: !!config.firebase.appId, value: config.firebase.appId },
      ],
      isValid: !!(config.firebase.apiKey && config.firebase.projectId),
    },
    {
      name: 'Razorpay',
      keys: [
        { key: 'VITE_RAZORPAY_KEY_ID', present: !!config.razorpay.keyId, value: config.razorpay.keyId },
      ],
      isValid: !!config.razorpay.keyId,
    },
    {
      name: 'Geo',
      keys: [
        { key: 'VITE_MAPS_PROVIDER', present: !!config.geo.provider, value: config.geo.provider },
      ],
      isValid: true, // Geo provider is optional
    },
  ];

  providers.forEach(provider => {
    provider.keys.forEach(keyInfo => {
      if (!keyInfo.present && provider.name !== 'Geo') {
        issues.push(`${provider.name}: ${keyInfo.key} missing`);
      }
    });
  });

  return {
    isValid: issues.length === 0,
    issues,
    config,
    providers,
  };
};