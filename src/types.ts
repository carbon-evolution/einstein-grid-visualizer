import { StellarStage } from './constants';

export interface SimulationState {
  mass: number;
  radius: number;
  stage: StellarStage;
  isRunning: boolean;
  schwarzschildRadius: number;
}

export interface Uniforms {
  uTime: { value: number };
  uMass: { value: number };
  uRadius: { value: number };
  uColor: { value: [number, number, number] };
  uGridColor: { value: [number, number, number] };
}