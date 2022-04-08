import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  async getUserState(): Promise<string> {
    return 'The server is running'
  }
}
