import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CompanyService } from './company.service';
import CompanyModel from './companyModel';
import { CreateCompanyDto } from './dto/create-company.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async all(): Promise<CompanyModel[]> {
    return await this.companyService.getAll();
  }

  @Get(':id')
  async getInfos(@Param('id') id): Promise<CompanyModel> {
    return this.companyService.getCompany(+id);
  }

  @Post()
  async insert(@Body() body: CreateCompanyDto): Promise<CompanyModel> {
    return await this.companyService.insertCompany({
      id:body.id,
      name: body.name,
      code: body.code,
    });
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() body): Promise<CompanyModel> {
    return await this.companyService.update(+id, body);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.companyService.remove(+id);
  // }

  //   @Get('/bye')
  //   getBye(): string {
  //     return this.appService.getBye();
  //   }
}
