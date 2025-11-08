import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { TaskDTO } from './dto/task.dto';

@UseGuards(AuthGuard)
@Controller('ai')
export class AiController {
	constructor(private readonly aiService: AiService) {
	}

	@Post('')
	aiTask(@Body() task: TaskDTO) {
		return this.aiService.promptToService(task.prompt)
	}
}
