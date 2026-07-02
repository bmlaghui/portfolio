import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // CORS for frontend
  app.enableCors({
    origin: [
      'http://localhost:4000',
      'http://portfolio-frontend:4000',
      'https://www.mlaghuibrahim.fr',
      'https://mlaghuibrahim.fr',
    ],
    credentials: true,
  });

  // Global API prefix
  app.setGlobalPrefix('api');

  // Seed default admin user on startup
  const authService = app.get(AuthService);
  await authService.seedAdminUser();

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Backend running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
