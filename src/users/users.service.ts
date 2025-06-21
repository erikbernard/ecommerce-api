import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BcryptService } from 'src/users/bcrypt.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    try {
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
      const password = await this.bcryptService.hashPassword(createUserDto.password);

      const user = this.userRepository.create({
        ...createUserDto, password
      });
      await this.userRepository.save(user);
      const { password: _, ...reponse } = user;
      return reponse;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signin(signinUserDto: SigninUserDto) {
    const { password, email } = signinUserDto;
    const user = await this.findByEmail(email);

    try {
      if (!user) {
        throw new ConflictException('Credentials invalid');
      }
      const isPasswordValid = await this.bcryptService.comparePassword(password, user.password);

      if (!isPasswordValid) {
        throw new ConflictException('Credentials invalid');
      }

      const token = this.jwtService.sign({ id: user.id, email: user.email, name: user.name });
      return { accessToken: token, id: user.id, email: user.email, name: user.name };
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findAll() {
    const userList = await this.userRepository.find(
      {
        select: ['id', 'email', 'created_at', 'updated_at'],
        order: { created_at: 'DESC' },
      }
    );
    return userList;
  }

  async findOne(id: string) {
    try {
      const user = await this.userRepository.findOne(
        { where: { id }, select: ['id', 'email', 'name', 'created_at', 'updated_at'] }
      )
      return user;
    } catch (error) {
      throw new ConflictException(`User with ID ${id} not found`);
    }
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email }, select: ['email', 'password', 'id', 'name'] });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new ConflictException(`User with ID ${id} not found`);
      }
      const updatedUser = Object.assign(user, updateUserDto);
      await this.userRepository.save(updatedUser);
      return updatedUser;
    } catch (error) {
      throw new ConflictException(`User with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      const user = await this.userRepository.delete({ id });
      if (user.affected === 0) {
        throw new ConflictException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new ConflictException(`User with ID ${id} not found`);
    }
  }
}
