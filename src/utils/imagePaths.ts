// Paths to local images (not dependent on MinIO)
// All images should be placed in public/images/

export const IMAGES = {
  CART: `${import.meta.env.BASE_URL || ''}images/cart.png`,
  LOGO: `${import.meta.env.BASE_URL || ''}images/logo.png`,
  DEFAULT_SERVICE: `${import.meta.env.BASE_URL || ''}images/default-service.png`,
} as const;

