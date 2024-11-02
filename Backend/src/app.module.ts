import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({ // Create module from our backend (you can split my monolith backend into many modules (that will be better for reading project architecture and it is right way to use modules))
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
