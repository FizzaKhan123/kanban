import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET! || "fd18b8832e225bc0f69432a14ad9c20c3dbbccf758decac5d77553e8743fc470",
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [JwtModule],
})
export class JwtGlobalModule {}