import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma.service';
import { LoginDto } from './dto/login.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Validate user credentials and generate JWT token
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    // Check if user exists in the database
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, username: true },
    });

    console.log('User:', user);

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token
    const token = this.generateJwt(user.id, user.email, user.username);

    return { token };
  }

  // Generate JWT token
  private generateJwt(userId: number, email: string, username: string): string {
    const payload = { userId, email, username };
    const secretKey = process.env.JWT_SECRET || 'your-secret-key'; // Use the secret key from environment variables
    const expiresIn = '1h';

    return jwt.sign(payload, secretKey, { expiresIn });
  }
}
