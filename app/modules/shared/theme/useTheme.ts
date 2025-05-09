import { colors, spacing, typography, borderRadius, shadows } from './theme';

export const useTheme = () => {
  return {
    colors,
    spacing,
    typography,
    borderRadius,
    shadows,
  };
}; 

export default useTheme;