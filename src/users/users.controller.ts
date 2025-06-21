import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new BadRequestException('User creation failed: ' + error.message);
    }
  }

  @Post('signin')
  async signin(@Body() signinUserDto: SigninUserDto) {
    try {
      return await this.usersService.signin(signinUserDto);
    } catch (error) {
      throw new BadRequestException(error.message || 'Signin failed');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    try {
      return this.usersService.findAll();
    } catch (error) {
      throw new BadRequestException(error.message || 'Failed to retrieve users');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
