import { colors, spacing, typography, borderRadius, shadows } from './theme';

export const useTheme = () => {
  return {
    mode: 'light',
    colors,
    spacing,
    typography,
    borderRadius,
    shadows,
  };
}; 

export default useTheme;