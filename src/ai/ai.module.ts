import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [AiController],
  providers: [AiService],
  imports: []
})
export class AiModule {}
