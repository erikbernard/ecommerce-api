import { registerAs } from "@nestjs/config";

export default registerAs('jwtConstants', () => ({
  secret: process.env.JWT_SECRET_KEY,
}));