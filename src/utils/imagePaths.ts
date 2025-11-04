// Paths to local images (not dependent on MinIO)
// All images should be placed in public/images/

export const IMAGES = {
  CART: `${process.env.PUBLIC_URL || ''}/images/cart.png`,
  LOGO: `${process.env.PUBLIC_URL || ''}/images/logo.png`,
  DEFAULT_SERVICE: `${process.env.PUBLIC_URL || ''}/images/default-service.png`,
} as const;

