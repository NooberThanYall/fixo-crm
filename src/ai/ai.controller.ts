import {
	Body,
	Controller,
	Post,
	Request as Req,
	UseGuards,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AiService, Task } from './ai.service';
import { AuthGuard } from 'src/guard/auth.guard';
import type { Request } from 'express';
import * as path from 'path';
import { PreviewService } from 'src/preview/preview.service';

@UseGuards(AuthGuard)
@Controller('ai')
export class AiController {
	constructor(
		private readonly aiService: AiService,
		private readonly previewService: PreviewService
	) { }

	@Post('')
	async aiTask(@Body('prompt') prompt: string, @Req() req: Request) {
		// @ts-expect-error req user undefined Type ------------------------
		const {id: userId} = req.user;


		const task: Task = await this.aiService.promptToTask(prompt, userId);

		this.previewService.setTask(task);
		return this.previewService.preview(userId)

	}

	@Post('voice')
	@UseInterceptors(FileInterceptor('voice', {
		storage: diskStorage({
			destination: './uploads',
			filename: (req, file, cb) => {
				const ext = path.extname(file.originalname);
				cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
			}
		})
	}))
	async handleVoice(
		@UploadedFile() file: Express.Multer.File,
		@Req() req: Request
	) {
		// @ts-expect-error req user

		return this.aiService.transcribeAndExecute(file.path, req.user.id);
	}
}
