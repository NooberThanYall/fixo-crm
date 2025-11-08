import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from './ai/ai.module';
import { ProductModule } from './product/product.module';
import { ExecutorModule } from './executor/executor.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

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
  }), AiModule, ProductModule, ExecutorModule, UserModule, AuthModule]
})
export class AppModule {}
