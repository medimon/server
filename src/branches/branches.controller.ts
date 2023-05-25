import { Controller, Get } from '@nestjs/common';
import { BranchesService } from './branches.service';
import BranchModel from './branchModel';
import branchesData from '../db/branchesData';

@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  all(): BranchModel[] {
    return branchesData;
  }

  @Get(':id')
  getBranch(): BranchModel {
    return branchesData[0];
  }
}
