import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  async updateUser(@Body() body:Partial<User>, @Req() req: Request) {
    //@ts-expect-error fuck you
    const newUser = this.userService.update(req.user.id ,body);

    return {...newUser, password: null, id: null}
  }
}
