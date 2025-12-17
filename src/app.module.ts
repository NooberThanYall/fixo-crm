import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from './ai/ai.module';
import { ProductModule } from './product/product.module';
import { ExecutorModule } from './executor/executor.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { PreviewModule } from './preview/preview.module';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './auth/auth.middleware';
import { join } from 'path';
import { SupportModule } from './support/support.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: "postgres",
    host: "localhost",
    port: 55432,
    username: "postgres",
    password: "password",
    database: "fixocrm",
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true
  }),
    AiModule, ProductModule, ExecutorModule, UserModule, AuthModule, PreviewModule,
  CacheModule.register({ isGlobal: true }),
  ConfigModule.forRoot({
    isGlobal: true
  }),
  ServeStaticModule.forRoot({
    rootPath: join(process.cwd(), 'uploads'),
    serveRoot: '/uploads',
  }),
  SupportModule,

  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*');
  }
}
