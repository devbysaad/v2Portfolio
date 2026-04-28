const PLACEHOLDER_PATTERNS = ['USER:PASSWORD', 'your-', 'YOUR-PASSWORD', 'HOST']

function hasPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERNS.some((pattern) => value.includes(pattern))
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name]?.trim()
  if (!value || hasPlaceholder(value)) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export function getOptionalEnv(name: string): string | null {
  const value = process.env[name]?.trim()
  if (!value || hasPlaceholder(value)) return null
  return value
}
