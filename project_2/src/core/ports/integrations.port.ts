export interface Integration {
  id: string;
  name: string;
  category: 'auth' | 'payments' | 'notifications' | 'storage' | 'analytics';
  provider: string;
  status: 'active' | 'inactive' | 'configured' | 'error';
  config: Record<string, any>;
  description: string;
  features: string[];
}

export interface IntegrationProvider {
  id: string;
  name: string;
  category: Integration['category'];
  description: string;
  features: string[];
  configSchema: Record<string, any>;
  isMock: boolean;
}

export interface IntegrationsPort {
  getIntegrations(): Promise<Integration[]>;
  getProviders(): Promise<IntegrationProvider[]>;
  getActiveProvider(category: Integration['category']): Promise<IntegrationProvider | null>;
  switchProvider(category: Integration['category'], providerId: string): Promise<Integration>;
  updateConfig(integrationId: string, config: Record<string, any>): Promise<Integration>;
  testIntegration(integrationId: string): Promise<{ success: boolean; message: string }>;
}