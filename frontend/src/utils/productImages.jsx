const PRODUCT_IMAGES = {
  'prod-001': '/images/products/switch.svg',
  'prod-002': '/images/products/wire.svg',
  'prod-003': '/images/products/mcb.svg',
  'prod-004': '/images/products/fan.svg',
  'prod-005': '/images/products/socket.svg',
  'prod-006': '/images/products/db-box.svg',
  'prod-007': '/images/products/bulb.svg',
  'prod-008': '/images/products/wire.svg',
  'havells-16a-modular-switch': '/images/products/switch.svg',
  'polycab-2-5sqmm-fr-wire': '/images/products/wire.svg',
  'schneider-32a-mcb': '/images/products/mcb.svg',
  'crompton-1200mm-ceiling-fan': '/images/products/fan.svg',
  'anchor-roma-6a-socket': '/images/products/socket.svg',
  'legrand-12-module-db-box': '/images/products/db-box.svg',
  'philips-9w-led-bulb-pack': '/images/products/bulb.svg',
  'finolex-4sqmm-fr-wire': '/images/products/wire.svg',
};

export function resolveProductImage(product) {
  if (!product) return '/images/products/switch.svg';
  return (
    PRODUCT_IMAGES[product.id] ||
    PRODUCT_IMAGES[product.slug] ||
    product.image ||
    '/images/products/switch.svg'
  );
}

export function ProductImage({ product, className, alt }) {
  const src = resolveProductImage(product);
  return (
    <img
      src={src}
      alt={alt || product?.name || 'Product'}
      className={className}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = PRODUCT_IMAGES[product?.id] || '/images/products/switch.svg';
      }}
    />
  );
}
