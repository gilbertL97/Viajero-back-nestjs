export class DaysCoverage implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const requiredRole = this.reflector.getAllAndOverride<UserRole[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRole) return true;
  
      const { user } = context.switchToHttp().getRequest();
      const hasRole = requiredRole.includes(user.role);
      return user && user.role && hasRole;
    }