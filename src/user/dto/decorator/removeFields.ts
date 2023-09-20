import { UserRole } from 'src/user/user.role';

export function ExcludeIfNotClient(params: any) {
  if (params.role !== UserRole.CLIENT || params.role !== UserRole.CLIENT)
    return undefined;
}
