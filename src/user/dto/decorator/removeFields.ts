import { UserRole } from 'src/user/user.role';
import { CreateUserDto } from '../create-user.dto';

export function ExcludeIfNotClient(params: any) {
  if (params.role !== UserRole.CLIENT || params.role !== UserRole.CLIENT)
    return undefined;
}
