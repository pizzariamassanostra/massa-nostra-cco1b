// ============================================
// ENTIDADE: CLIENTES (COMMON USERS)
// ============================================
// Cadastro completo de clientes da pizzaria
// Incluindo validação LGPD e autenticação
// ============================================

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('common_users')
export class CommonUser {
  // ============================================
  // IDENTIFICAÇÃO PRINCIPAL
  // ============================================
  @PrimaryGeneratedColumn()
  id: number; // ID sequencial

  // ============================================
  // DADOS PESSOAIS BÁSICOS
  // ============================================
  @Column({ length: 255 })
  name: string; // Nome completo (obrigatório)

  @Column({ length: 14, unique: true, nullable: true })
  cpf: string; // CPF no formato: 000.000.000-00 (único, opcional)

  @Column({ type: 'date', nullable: true })
  birth_date: Date; // Data de nascimento (opcional)

  // ============================================
  // INFORMAÇÕES DE CONTATO
  // ============================================
  @Column({ length: 20, unique: true })
  phone: string; // Telefone principal - ÚNICO e OBRIGATÓRIO (ex: 38999999999)

  @Column({ length: 20, nullable: true })
  phone_alternative: string; // Telefone alternativo (opcional)

  @Column({ length: 255, nullable: true })
  email: string; // Email (opcional, usado para promoções/recibos)

  // ============================================
  // AUTENTICAÇÃO E SEGURANÇA
  // ============================================
  @Column({ length: 255, nullable: true })
  password_hash: string; // Senha criptografada com bcrypt (opcional - pode criar depois)

  // ============================================
  // TERMOS DE USO E LGPD
  // ============================================
  @Column({ default: false })
  accept_terms: boolean; // Cliente aceitou termos de uso (LGPD)

  @Column({ default: false })
  accept_promotions: boolean; // Cliente aceitou receber promoções por email/WhatsApp

  // ============================================
  // AUDITORIA E CONTROLE
  // ============================================
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date; // Data de cadastro

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date; // Última atualização

  @DeleteDateColumn({ type: 'timestamptz', select: false })
  deleted_at: Date; // Soft delete (mantém log no banco)
  nome_completo: string;
}
