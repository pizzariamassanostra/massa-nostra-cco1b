// ============================================
// GUARD: JWT AUTH (COM ROLES)
// ============================================
// Sistema de autenticação da API
// - Valida JWT
// - Injeta roles do usuário no request
// ============================================

// ============================================
// IMPORTS
// ============================================
import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from '@/modules/rbac/entities/user-role.entity';

// ============================================
// CLASSE: JwtAuthGuard
// ============================================
@Injectable()
class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {
    super();
  }

  // ============================================
  // MÉTODO: canActivate
  // ============================================
  // - Valida JWT via strategy
  // - Carrega roles do usuário autenticado
  // - Injeta roles no objeto request.user
  // ============================================
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // ============================================
    // VALIDAÇÃO DO JWT
    // ============================================
    const isValid = await super.canActivate(context);

    if (!isValid) {
      return false;
    }

    // ============================================
    // OBTÉM REQUEST E USUÁRIO
    // ============================================
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Usuário precisa estar autenticado
    if (!user) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    // ============================================
    // BUSCAR ROLES DO USUÁRIO
    // ============================================
    try {
      const userRoles = await this.userRoleRepository.find({
        where: { user_id: user.id },
        relations: ['role'],
      });

      // Injeta nomes das roles no objeto user
      user.roles = userRoles.map((ur) => ur.role.name);

      // Garante array mesmo sem roles
      if (!user.roles || user.roles.length === 0) {
        user.roles = [];
      }
    } catch (error) {
      // Em caso de erro, não quebra autenticação
      console.error('Erro ao buscar roles:', error);
      user.roles = [];
    }

    return true;
  }
}

// ============================================
// EXPORTAÇÃO
// ============================================
export { JwtAuthGuard };
