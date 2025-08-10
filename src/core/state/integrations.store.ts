import { create } from 'zustand';

export interface IntegrationConfig {
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
    webhookUrl: string;
    returnUrl: string;
  };
  geo: {
    provider: 'none' | 'mock' | 'geofire' | 'google';
  };
  mockAdmin: boolean;
}

interface IntegrationsState {
  config: IntegrationConfig;
  updateFirebaseConfig: (config: Partial<IntegrationConfig['firebase']>) => void;
  updateRazorpayConfig: (config: Partial<IntegrationConfig['razorpay']>) => void;
  updateGeoProvider: (provider: IntegrationConfig['geo']['provider']) => void;
  toggleMockAdmin: () => void;
  loadConfig: () => void;
}

const defaultConfig: IntegrationConfig = {
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  },
  razorpay: {
    keyId: '',
    webhookUrl: '',
    returnUrl: '',
  },
  geo: {
    provider: 'mock',
  },
  mockAdmin: false,
};

export const useIntegrationsStore = create<IntegrationsState>((set, get) => ({
  config: defaultConfig,
  
  updateFirebaseConfig: (newConfig) => {
    const currentConfig = get().config;
    const updatedConfig = {
      ...currentConfig,
      firebase: { ...currentConfig.firebase, ...newConfig },
    };
    set({ config: updatedConfig });
    localStorage.setItem('integrations_config', JSON.stringify(updatedConfig));
  },
  
  updateRazorpayConfig: (newConfig) => {
    const currentConfig = get().config;
    const updatedConfig = {
      ...currentConfig,
      razorpay: { ...currentConfig.razorpay, ...newConfig },
    };
    set({ config: updatedConfig });
    localStorage.setItem('integrations_config', JSON.stringify(updatedConfig));
  },
  
  updateGeoProvider: (provider) => {
    const currentConfig = get().config;
    const updatedConfig = {
      ...currentConfig,
      geo: { provider },
    };
    set({ config: updatedConfig });
    localStorage.setItem('integrations_config', JSON.stringify(updatedConfig));
    localStorage.setItem('geo_provider', provider);
  },
  
  toggleMockAdmin: () => {
    const currentConfig = get().config;
    const updatedConfig = {
      ...currentConfig,
      mockAdmin: !currentConfig.mockAdmin,
    };
    set({ config: updatedConfig });
    localStorage.setItem('integrations_config', JSON.stringify(updatedConfig));
  },
  
  loadConfig: () => {
    const stored = localStorage.getItem('integrations_config');
    if (stored) {
      try {
        const config = JSON.parse(stored);
        set({ config: { ...defaultConfig, ...config } });
      } catch (error) {
        console.error('Failed to load integrations config:', error);
      }
    }
    
    // Load individual provider settings
    const geoProvider = localStorage.getItem('geo_provider') as IntegrationConfig['geo']['provider'];
    if (geoProvider) {
      const currentConfig = get().config;
      set({
        config: {
          ...currentConfig,
          geo: { provider: geoProvider },
        },
      });
    }
  },
}));