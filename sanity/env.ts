export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-12-15'

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';

if (!projectId) {
  console.warn('Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Sanity features may not work correctly.');
}

export const useCdn = false
