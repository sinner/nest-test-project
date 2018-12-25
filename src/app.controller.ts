import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
import TranslatorService from './translations/translator.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly translator: TranslatorService,
  ) {}

  @Get()
  root(): string {
    return this.appService.root();
  }
}
