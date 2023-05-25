import { Controller, Get } from '@nestjs/common';
import { UnitsService } from './units.service';
import UnitModel from './unitModel';
import unitsData from '../db/unitsData';

@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  all(): UnitModel[] {
    return unitsData;
  }

}