import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';
import { JwtGlobalModule } from '@modules/JwtGlobalModule';
import { PostgressDatabaseProviderModule } from './providers/database/postgress/provider.module';


@Module({
  imports: [UserModule, TaskModule,JwtGlobalModule,PostgressDatabaseProviderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
