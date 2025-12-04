// Normalized constants for visualization
export const G = 0.4; // Reduced to keep Event Horizons visually manageable
export const C = 1; // Speed of light
export const INITIAL_MASS = 1.0; // Solar masses
export const MAX_MASS = 8.0; // Range to allow for Black Hole phase

// Thresholds in Solar Masses
export const CHANDRASEKHAR_LIMIT = 1.4;
export const TOV_LIMIT = 2.8; // Approximate Tolman-Oppenheimer-Volkoff limit

// Display Constants
export const GRID_SIZE = 40;
export const GRID_SEGMENTS = 200;
export const SIMULATION_SPEED = 0.001; // Further slowed down for better observation

// Positions for Dual View
export const POS_EARTH = [-8, 0, 0] as [number, number, number];
export const POS_EVOLVING = [8, 0, 0] as [number, number, number];

// Visual constants for Earth (not physically accurate to scale, but relative for visual)
export const EARTH_VISUAL_MASS = 0.15;
export const EARTH_VISUAL_RADIUS = 0.8;

export enum StellarStage {
  EARTH = 'Earth',
  SUN = 'Main Sequence Star',
  WHITE_DWARF = 'White Dwarf',
  NEUTRON_STAR = 'Neutron Star',
  BLACK_HOLE = 'Black Hole'
}

export const STAGE_COLORS = {
  [StellarStage.EARTH]: '#006400', // Deep Dark Green
  [StellarStage.SUN]: '#FDB813',
  [StellarStage.WHITE_DWARF]: '#AACCFF',
  [StellarStage.NEUTRON_STAR]: '#00FFFF',
  [StellarStage.BLACK_HOLE]: '#FF3300' // Red/Orange to represent the dangerous accretion/photon ring
};