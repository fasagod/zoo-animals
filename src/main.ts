import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .setTitle('Zoo animals')
    .setDescription('Zoo animals API description')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', in: 'header' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => {
  console.log(err);
});
