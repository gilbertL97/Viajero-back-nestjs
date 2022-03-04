import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { UserRole } from '../user.role';

export class RoleValidationPipes implements PipeTransform {
  readonly allowedRoles = [
    UserRole.ADMIN,
    UserRole.CLIENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
    UserRole.MARKAGENT,
  ];

  transform(value: string) {
    value = value.toLowerCase();
    const role = this.isRoleValid(value);
    if (!role) throw new BadRequestException(`"${value}"is a invalid role`);
    return role;
  }
  private isRoleValid(role: any) {
    const isRole: any = this.allowedRoles.indexOf[role];
    return isRole;
  }
}
