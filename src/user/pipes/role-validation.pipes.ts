import { BadRequestException, PipeTransform } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserRole } from '../user.role';

export class RoleValidationPipes implements PipeTransform {
  readonly allowedRoles = [
    UserRole.ADMIN,
    UserRole.CLIENT,
    UserRole.COMAGENT,
    UserRole.CONSULT,
    UserRole.MARKAGENT,
  ];

  transform(value: UpdateUserDto) {
    console.log(value.role);
    if (value.role) {
      const isRole: string = value.role.toLowerCase();
      console.log(this.allowedRoles);
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
