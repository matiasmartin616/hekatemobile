import { useEffect, useState } from "react";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";

const ANIMATION_CONFIG = {
  duration: 400,
  easing: Easing.bezier(0.25, 1, 0.5, 1),
};

export function useCardFlip(isImageLoaded: boolean) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipProgress = useSharedValue(0);
  const flipInstructionOpacity = useSharedValue(1);

  const flipCard = () => {
    const targetValue = isFlipped ? 0 : 1;
    flipProgress.value = withTiming(targetValue, ANIMATION_CONFIG);
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    if (!isImageLoaded) return;

    flipInstructionOpacity.value = 1;
    const timeout = setTimeout(() => {
      flipInstructionOpacity.value = withTiming(0, { duration: 500 });
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isImageLoaded, flipInstructionOpacity]);

  return {
    isFlipped,
    flipProgress,
    flipCard,
    flipInstructionOpacity,
  };
}
