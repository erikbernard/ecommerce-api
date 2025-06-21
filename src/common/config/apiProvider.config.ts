import { registerAs } from '@nestjs/config';

export default registerAs('apiProvider', () => ({
  providerBR: process.env.BRAZILIAN_PROVIDER_URL || "https://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider",
  providerEU: process.env.EUROPEAN_PROVIDER_URL || "https://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider",
}));