export function validateAuthInput(email: string, password: string): { valid: boolean; error?: string } {
  if (!email || !password) {
    return { valid: false, error: 'Correo y contraseña son requeridos' }
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Correo electrónico no válido' }
  }

  // Validar longitud de contraseña (mínimo 8 caracteres)
  if (password.length < 8) {
    return { valid: false, error: 'La contraseña debe tener al menos 8 caracteres' }
  }

  // Validar que la contraseña tenga mayúsculas, minúsculas y números
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, error: 'La contraseña debe contener mayúsculas, minúsculas y números' }
  }

  return { valid: true }
}
