import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        })
    );

    app.enableCors();

    await app.listen(3000);
    console.log('🚀 Sistema de Coleta de Lixo Maringá rodando na porta 3000');
}

bootstrap();
