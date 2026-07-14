// Enmascara datos personales para mostrarlos en el panel público
// (el sitio es un link público; no exponemos correos ni teléfonos completos).

export function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at < 1) return "•••";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const visible = local.slice(0, 2);
  const masked = local.length <= 2 ? visible : `${visible}•••`;
  return `${masked}@${domain}`;
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 3) return "•••";
  return `••• ••• •${digits.slice(-2)}`;
}
