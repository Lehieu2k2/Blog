import { Global, Module } from '@nestjs/common';
import { GeneratorService } from './services/generator.service';

@Global() // Makes this module global so we don't need to import it everywhere
@Module({
  providers: [GeneratorService],
  exports: [GeneratorService],
})
export class SharedModule {}
