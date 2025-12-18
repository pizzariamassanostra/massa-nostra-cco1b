// ============================================
// CONTROLLER: PAINEL ADMIN
// ============================================

import { Controller, Get, Render } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Admin Panel')
@Controller('admin')
export class AdminPanelController {
  @Get()
  @ApiOperation({ summary: 'Página inicial do painel admin' })
  getAdminPanel() {
    return {
      ok: true,
      message: 'Painel administrativo',
      loginUrl: '/admin/login',
      apiDocs: '/api',
    };
  }

  @Get('login')
  @ApiOperation({ summary: 'Página de login do admin' })
  getLoginPage() {
    return {
      ok: true,
      message: 'Página de login administrativo',
      instruction: 'Use POST /auth/admin/login para autenticar',
    };
  }
}
