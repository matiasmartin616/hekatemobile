import { api } from '@shared/services/api';

export interface VisualizationConfig {
  timesPerDay: number;
  breakpoints: string[];
}

export const visualizationConfigApi = {
  // Get current visualization configuration
  getConfig: async (): Promise<VisualizationConfig> => {
    return await api.get<VisualizationConfig>('/visualization-config');
  },

  // Update visualization configuration
  updateConfig: async (config: VisualizationConfig): Promise<VisualizationConfig> => {
    return await api.post<VisualizationConfig>('/visualization-config', config);
  }
};

export default visualizationConfigApi;