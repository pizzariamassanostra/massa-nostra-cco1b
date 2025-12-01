// ============================================
// GUARD: AUTENTICAÇÃO LOCAL
// ============================================
// Usado no endpoint de login
// Pizzaria Massa Nostra - ADMIN
// ============================================

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
