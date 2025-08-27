import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/database/ormconfig';
import { CategoryModule } from 'src/modules/category/category.module';
import { CommentModule } from 'src/modules/comment/comment.module';
import { TagModule } from 'src/modules/tag/tag.module';
import { UploadModule } from 'src/modules/upload/upload.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostController } from './modules/post/post.controller';
import { PostModule } from './modules/post/post.module';
import { UserModule } from './modules/user/user.module';
import { SharedModule } from './shared/shared.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          // ignoreTLS: true,
          // secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        // preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    UploadModule,
    UserModule,
    AuthModule,
    PostModule,
    CategoryModule,
    CommentModule,
    TagModule,
  ],
  controllers: [AppController, PostController],
  providers: [AppService],
})
export class AppModule {}
