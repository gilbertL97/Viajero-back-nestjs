import { BadRequestException, PipeTransform } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRole } from '../user.role';

export class RoleValidationPipes implements PipeTransform {
  readonly allowedRoles = [
    UserRole.ADMIN,
    UserRole.COMAGENT,
    UserRole.CONSULT,
    UserRole.MARKAGENT,
    UserRole.CLIENT,
    UserRole.CONSULTAGENT,
  ];
  //este es un pipe para validar los roles q me entren en la peticion
  transform(value: UpdateUserDto) {
    if (value.role) {
      const isRole: string = value.role.toLowerCase();
      const role: number = this.isRoleValid(isRole);
      if (role === -1)
        throw new BadRequestException(`${isRole} is a invalid role`);
    }
    return value;
  }
  private isRoleValid(isRole: any) {
    const role: number = this.allowedRoles.indexOf(isRole);
    return role;
  }
}
