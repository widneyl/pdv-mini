import { createTamagui } from 'tamagui';
import { config } from '@tamagui/config';

export const tamaguiConfig = createTamagui(config);

export type AppTamaguiConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}