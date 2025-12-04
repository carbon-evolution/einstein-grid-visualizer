
import { StellarStage, CHANDRASEKHAR_LIMIT, TOV_LIMIT, G, C, EARTH_VISUAL_RADIUS } from '../constants';

export const calculateSchwarzschildRadius = (mass: number): number => {
  return (2 * G * mass) / (C * C);
};

export const determineStage = (mass: number): StellarStage => {
  // If we were simulating Earth mass evolution we'd need checks here, 
  // but for the animation loop we only pass the evolving mass starting at 1.0.
  // We'll treat mass < 0.5 as Earth just in case, though App.tsx handles the loop.
  if (mass < 0.5) return StellarStage.EARTH; 
  if (mass < CHANDRASEKHAR_LIMIT) return StellarStage.SUN;
  if (mass < TOV_LIMIT) return StellarStage.NEUTRON_STAR;
  return StellarStage.BLACK_HOLE;
};

// A visual approximation of radius shrinking as mass/density increases
export const calculateRadius = (mass: number, stage: StellarStage): number => {
  const rs = calculateSchwarzschildRadius(mass);

  switch (stage) {
    case StellarStage.EARTH:
      return EARTH_VISUAL_RADIUS;
    case StellarStage.SUN:
      // Reduced visual radius (starts at 2.8) so it doesn't hide the 
      // curvature grid forming around it.
      return Math.max(1.8, 2.8 - (mass - 1.0) * 1.5); 
    case StellarStage.WHITE_DWARF:
       // Small dense object
      return 1.2;
    case StellarStage.NEUTRON_STAR:
      // Very small, compact
      return 0.7;
    case StellarStage.BLACK_HOLE:
      // For the Black Hole, we visualize the Event Horizon.
      // We return the exact Schwarzschild radius.
      return rs; 
    default:
      return 3.0;
  }
};