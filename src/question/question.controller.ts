import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { QuestionService } from './question.service'
import { CreateQuestionDto } from './dto/create-question.dto'
import { UpdateQuestionDto } from './dto/update-question.dto'

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto)
  }

  // @Get('/all')
  // @UseGuards(AuthGuard('jwt'))
  // async findAll(@Request() req: express.Request) {
  //   const authZero = new ManagementClient({
  //     domain: 'dev-khy838sb.us.auth0.com',
  //     clientId: 'q1xEjRGpj2LOByVD7Vk3NWd5KQfEzOls',
  //     clientSecret:
  //       'X-p-5quB09v1lXFyeK_Ir_vKLE9wcez7ZQjB46tbKeVMAM2gGOAyUFYSJnmW8Bij',
  //     scope: 'read:users update:users',
  //   });

  //   const res = await authZero
  //     .getUser({ id: req.user })
  //     .then((user: User) => {
  //       return user;
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  //   return this.questionService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, updateQuestionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id)
  }
}
