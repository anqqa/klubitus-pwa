import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Klubitus API')
    // .setSchemes('https')
    .addTag('Events', 'Event calendar')
    .addTag('Forum', 'Discussion forums')
    .addTag('Images', 'Image galleries')
    .addTag('Music', 'Tracks and mixtapes')
    .addTag('Newsfeed', 'News feed')
    .addTag('Shouts', 'Shouts')
    .addTag('Users', 'Users')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/docs', app, document);
};
