// OWNER: Person 4 (Design system)
// Surface: web only — but mirrors tokens from @quietspace/shared-ui/tokens
// Do not edit without coordinating in group chat.

import type { Config } from 'tailwindcss';
import { tokens } from '../../packages/shared-ui/src/tokens';

// TODO(Person 4): finish mapping every token group into theme.extend
// TODO(Person 4): add font family + typography plugin if needed

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/shared-ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: tokens.color,
      borderRadius: tokens.radius,
      spacing: tokens.spacing,
      fontFamily: {
        sans: [tokens.font.sans],
        mono: [tokens.font.mono],
      },
    },
  },
  plugins: [],
};

export default config;
