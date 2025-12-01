// ============================================
// TYPE: PARTIAL PROFUNDO
// ============================================
// Permite partial em objetos aninhados
// Usado para atualizações parciais de recursos
// ============================================

export type DeepPartial<K> = {
  [attr in keyof K]?: K[attr] extends object
    ? DeepPartial<K[attr]>
    : K[attr] extends object | null
      ? DeepPartial<K[attr]> | null
      : K[attr] extends object | null | undefined
        ? DeepPartial<K[attr]> | null | undefined
        : K[attr];
};
