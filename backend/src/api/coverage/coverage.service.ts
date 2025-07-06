import { Injectable } from '@nestjs/common';
import { CreateCoverageDto } from './dto/create-coverage.dto';
import { UpdateCoverageDto } from './dto/update-coverage.dto';

@Injectable()
export class CoverageService {
  create(createCoverageDto: CreateCoverageDto) {
    return 'This action adds a new coverage';
  }

  findAll() {
    return `This action returns all coverage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coverage`;
  }

  update(id: number, updateCoverageDto: UpdateCoverageDto) {
    return `This action updates a #${id} coverage`;
  }

  remove(id: number) {
    return `This action removes a #${id} coverage`;
  }
}
