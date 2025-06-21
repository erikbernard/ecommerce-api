import { registerAs } from '@nestjs/config';

export default registerAs('apiProvider', () => ({
  providerBR: process.env.BRAZILIAN_PROVIDER_URL,
  providerEU: process.env.EUROPEAN_PROVIDER_URL,
}));