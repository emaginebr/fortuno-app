/**
 * Extrai até 2 iniciais do nome do usuário para exibição no avatar.
 * - "Rodrigo Landim" → "RL"
 * - "Ana" → "A"
 * - undefined / '' → "F" (fallback Fortuno)
 */
export const getInitials = (name?: string | null): string => {
  if (!name) return 'F';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'F';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  const first = parts[0].charAt(0);
  const last = parts[parts.length - 1].charAt(0);
  return `${first}${last}`.toUpperCase();
};
