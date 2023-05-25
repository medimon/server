import { Body, Get, Injectable, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import CompanyModel from './companyModel';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

  async getAll(): Promise<CompanyModel[]> {
    return await this.prisma.company.findMany();
  }

  getCompany(id: number): Promise<CompanyModel> {
    return this.prisma.company.findFirst({ where: { id } });
  }

  async insertCompany(company: CompanyModel): Promise<CompanyModel> {
    return await this.prisma.company.create({ data: company });
  }

  async update(id: number, company: CompanyModel): Promise<CompanyModel> {
    return this.prisma.company.update({
      where: { id },
      data: company,
    });
  }
}

//  return {
//       name: 'ABC Company',
//       code: 'ABC-1234',
//       legalForm: 'EURL',
//       businessName: 'ABC Inc.',
//       sector: 'Technology',
//       location: {
//         country: 'Algeria',
//         wilaya: 'Algiers',
//         city: 'Algiers',
//         street: '123 Main Street',
//       },
//       contact: {
//         phone: '555-1234',
//         fax: '555-5678',
//         mail: 'info@abccompany.com',
//       },
//       rc: '123456',
//       nif: 'ABC-123-XYZ',
//       nis: 'XYZ-456-ABC',
//       art: '789',
//       date: new Date(),
//     };
