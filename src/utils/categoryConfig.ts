export interface CategoryStyle {
  color: string;
  bgLight: string;
  borderColor: string;
  icon: string;
}

export const categoryStyles: Record<string, CategoryStyle> = {
  'menschen-begegnung': {
    color: '#FF6B35',
    bgLight: 'rgba(255, 107, 53, 0.1)',
    borderColor: 'rgba(255, 107, 53, 0.3)',
    icon: 'users'
  },
  'licht-schatten': {
    color: '#6366F1',
    bgLight: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'rgba(99, 102, 241, 0.3)',
    icon: 'sun-moon'
  },
  'perspektive-detail': {
    color: '#14B8A6',
    bgLight: 'rgba(20, 184, 166, 0.1)',
    borderColor: 'rgba(20, 184, 166, 0.3)',
    icon: 'scan-eye'
  },
  'stimmung-atmosphaere': {
    color: '#EC4899',
    bgLight: 'rgba(236, 72, 153, 0.1)',
    borderColor: 'rgba(236, 72, 153, 0.3)',
    icon: 'sparkles'
  },
  'bonus': {
    color: '#F59E0B',
    bgLight: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    icon: 'trophy'
  },
  'community-moment': {
    color: '#3B82F6',
    bgLight: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    icon: 'camera'
  },
  'default': {
    color: '#3B82F6',
    bgLight: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    icon: 'camera'
  }
};

export function getCategoryStyle(slug: string): CategoryStyle {
  return categoryStyles[slug] || categoryStyles.default;
}
