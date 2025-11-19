import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
   constructor(
      @InjectRepository(User)
      private readonly userRepo: Repository<User>,
   ) { }

   async create(data: Partial<User>) {
      const user = this.userRepo.create(data);
      return this.userRepo.save(user);
   }

   async findAll() {
      return this.userRepo.find({ relations: ['products'] });
   }

   async findById(id: string) {
      return this.userRepo.findOne({ where: { id }, relations: ['products'] });
   }

   async findByPhone(phone: string) {
      return this.userRepo.findOne({ where: { phone }, relations: ['products'] });
   }

   async findByEmail(email: string) {
      return this.userRepo.findOne({ where: { email } });
   }

   async update(id: string, data: Partial<User>) {
      await this.userRepo.update(id, data);
      return this.findById(id);
   }

   async delete(id: string) {
      return this.userRepo.delete(id);
   }
}
