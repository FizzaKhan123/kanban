import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entities/user.entity';
import { CreateUserDto, LoginUserDto, UserResponseDto } from '@common/dto/user/user-dto';

import * as bcrypt from 'bcrypt';
import  { JwtService } from "@nestjs/jwt"

@Injectable()
export class UserService {
  constructor(
   private jwtService: JwtService ,
   @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  private generateToken(user: User): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret){
      return this.jwtService.sign(
        { id: user.id, email: user.email });
    }
    else {
      return "";
    }
  }
  async signup(createUserDto: CreateUserDto): Promise<{ token: string; user: UserResponseDto }> {
    const { username, email, password } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    const token = this.generateToken(savedUser);

    return {
      token,
      user: this.toResponseDto(savedUser),
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string; user: UserResponseDto }> {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      token,
      user: this.toResponseDto(user),
    };
  }
}
