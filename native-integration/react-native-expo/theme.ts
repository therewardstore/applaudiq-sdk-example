/** Applaud IQ brand palette — sampled from the brand logo (the SDK theme). Shared by all screens. */
export const Brand = {
  violet: '#7A3AED',
  indigo: '#5146E5',
  surface: '#F6F5FF',
  ink: '#1B1630',
  muted: '#6B6786',
  cardBorder: '#E8E6F6',
  white: '#FFFFFF',
  gradient: ['#7A3AED', '#5146E5'] as [string, string],
  status: {
    idle: '#6B6786',
    loading: '#7A3AED',
    success: '#1E9E62',
    pending: '#C07A00',
    error: '#D23B53',
  },
} as const;
