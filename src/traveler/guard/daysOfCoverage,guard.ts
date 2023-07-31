import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { ContractorService } from 'src/contractor/service/contractor.service';

@Injectable()
export class ValidateCoverage implements CanActivate {
  constructor(private contracorService: ContractorService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const contractor = await this.contracorService.getContractor(
      request.body.contractor,
    );
    if (contractor) return true;
    throw new NotFoundException('Cobertura no encontrada');
  }
}
