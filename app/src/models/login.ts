export type LoginMethod = 'voucher' | 'mpesa' | 'credentials'

export type LoginInput =
  | { method: 'voucher'; code: string }
  | { method: 'mpesa'; code: string }
  | { method: 'credentials'; username: string; password: string }

/** Why a reconnect attempt did not work. The view turns these into words. */
export type LoginError =
  | 'invalid_input' // empty or badly formed
  | 'not_found' // code not recognised
  | 'used_or_expired' // voucher already used, or package already ended
  | 'invalid_credentials' // wrong username or password
  | 'network'

/** Trims input; M-Pesa codes are always upper case. */
export function normalizeLoginInput(input: LoginInput): LoginInput {
  switch (input.method) {
    case 'voucher':
      return { method: 'voucher', code: input.code.trim() }
    case 'mpesa':
      return { method: 'mpesa', code: input.code.replace(/\s/g, '').toUpperCase() }
    case 'credentials':
      // Passwords are never trimmed or altered.
      return { method: 'credentials', username: input.username.trim(), password: input.password }
  }
}

export function isLoginInputValid(input: LoginInput): boolean {
  switch (input.method) {
    case 'voucher':
      return input.code.length > 0
    case 'mpesa':
      // M-Pesa receipt codes are 10 letters and digits; stay lenient, the backend verifies.
      return /^[A-Z0-9]{8,12}$/.test(input.code)
    case 'credentials':
      return input.username.length > 0 && input.password.length > 0
  }
}
