import { useEffect, useState } from "react";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";

const ANIMATION_CONFIG = {
  duration: 400,
  easing: Easing.bezier(0.25, 1, 0.5, 1),
};

export function useCardFlip(
  isImageLoaded: boolean,
  isEditing: boolean = false
) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipProgress = useSharedValue(0);
  const flipInstructionOpacity = useSharedValue(1);

  const flipCard = () => {
    if (isEditing) return; // Prevent flipping when editing

    const targetValue = isFlipped ? 0 : 1;
    flipProgress.value = withTiming(targetValue, ANIMATION_CONFIG);
    setIsFlipped(!isFlipped);
  };

  const forceToFront = () => {
    if (isFlipped) {
      flipProgress.value = withTiming(0, ANIMATION_CONFIG);
      setIsFlipped(false);
    }
  };

  // Force card to front when editing mode is activated
  useEffect(() => {
    if (isEditing) {
      forceToFront();
    }
  }, [isEditing]);

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
    forceToFront,
  };
}
