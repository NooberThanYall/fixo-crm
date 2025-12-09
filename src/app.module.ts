import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
  CacheModule.register({ isGlobal: true }),
    AiModule, ProductModule, ExecutorModule, UserModule, AuthModule, PreviewModule,
  ConfigModule.forRoot({
    isGlobal: true
  })
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*');
  }
}
