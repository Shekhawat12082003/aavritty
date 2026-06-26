import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'wires-cables' },
      update: { image: '/categories/wires-cables.jpg' },
      create: {
        name: 'Wires & Cables',
        slug: 'wires-cables',
        description: 'Electrical wires and cables for all applications',
        image: '/categories/wires-cables.jpg',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'switches-sockets' },
      update: { image: '/categories/switches-sockets.jpg' },
      create: {
        name: 'Switches & Sockets',
        slug: 'switches-sockets',
        description: 'Modular switches and sockets',
        image: '/categories/switches-sockets.jpg',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'circuit-breakers' },
      update: { image: '/categories/circuit-breakers.jpg' },
      create: {
        name: 'Circuit Breakers',
        slug: 'circuit-breakers',
        description: 'MCBs, MCCBs, and circuit protection devices',
        image: '/categories/circuit-breakers.jpg',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'distribution-boards' },
      update: { image: '/categories/distribution-boards.jpg' },
      create: {
        name: 'Distribution Boards',
        slug: 'distribution-boards',
        description: 'DB boxes and distribution panels',
        image: '/categories/distribution-boards.jpg',
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fans-lighting' },
      update: { image: '/categories/fans-lighting.jpg' },
      create: {
        name: 'Fans & Lighting',
        slug: 'fans-lighting',
        description: 'Ceiling fans, lights, and fixtures',
        image: '/categories/fans-lighting.jpg',
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'industrial' },
      update: { image: '/categories/industrial.jpg' },
      create: {
        name: 'Industrial Equipment',
        slug: 'industrial',
        description: 'Industrial electrical equipment and machinery',
        image: '/categories/industrial.jpg',
        sortOrder: 6,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'havells' },
      update: {},
      create: { name: 'Havells', slug: 'havells' },
    }),
    prisma.brand.upsert({
      where: { slug: 'polycab' },
      update: {},
      create: { name: 'Polycab', slug: 'polycab' },
    }),
    prisma.brand.upsert({
      where: { slug: 'schneider' },
      update: {},
      create: { name: 'Schneider', slug: 'schneider' },
    }),
    prisma.brand.upsert({
      where: { slug: 'legrand' },
      update: {},
      create: { name: 'Legrand', slug: 'legrand' },
    }),
    prisma.brand.upsert({
      where: { slug: 'crompton' },
      update: {},
      create: { name: 'Crompton', slug: 'crompton' },
    }),
    prisma.brand.upsert({
      where: { slug: 'anchor' },
      update: {},
      create: { name: 'Anchor', slug: 'anchor' },
    }),
    prisma.brand.upsert({
      where: { slug: 'philips' },
      update: {},
      create: { name: 'Philips', slug: 'philips' },
    }),
    prisma.brand.upsert({
      where: { slug: 'finolex' },
      update: {},
      create: { name: 'Finolex', slug: 'finolex' },
    }),
  ]);

  console.log(`✅ Created ${brands.length} brands`);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aavritty.com' },
    update: {},
    create: {
      email: 'admin@aavritty.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log('✅ Created admin user');

  // Create vendor user
  const vendorPassword = await bcrypt.hash('vendor123', 10);
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@aavritty.com' },
    update: {},
    create: {
      email: 'vendor@aavritty.com',
      password: vendorPassword,
      firstName: 'John',
      lastName: 'Vendor',
      role: 'VENDOR',
      isVerified: true,
    },
  });

  const vendor = await prisma.vendor.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      businessName: 'Electrical Supplies Co.',
      gstNumber: '29ABCDE1234F1Z5',
      isVerified: true,
    },
  });

  console.log('✅ Created vendor user and vendor profile');

  // Create sample products
  const products = [];
  for (let i = 1; i <= 20; i++) {
    const category = categories[i % categories.length];
    const brand = brands[i % brands.length];
    const product = await prisma.product.create({
      data: {
        vendorId: vendor.id,
        categoryId: category.id,
        brandId: brand.id,
        name: `${brand.name} ${category.name} Product ${i}`,
        slug: `${brand.slug}-${category.slug}-product-${i}`,
        sku: `SKU-${i.toString().padStart(6, '0')}`,
        description: `High-quality ${category.name} from ${brand.name}. Perfect for residential and commercial use.`,
        shortDescription: `${brand.name} ${category.name}`,
        price: 100 + i * 50,
        wholesalePrice: 80 + i * 40,
        mrp: 150 + i * 60,
        gstRate: 18,
        minOrderQty: 1,
        unit: 'piece',
        isActive: true,
        isFeatured: i <= 8,
        inventory: {
          create: {
            quantity: 50 + i * 10,
            reservedQty: 0,
            lowStockAlert: 10,
          },
        },
      },
    });
    products.push(product);
  }

  console.log(`✅ Created ${products.length} products`);

  // Create customer user
  const customerPassword = await bcrypt.hash('customer123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      password: customerPassword,
      firstName: 'Rahul',
      lastName: 'Sharma',
      role: 'CUSTOMER',
      isVerified: true,
    },
  });

  console.log('✅ Created customer user');

  // Create sample order
  const order = await prisma.order.create({
    data: {
      userId: customer.id,
      orderNumber: `ORD-${Date.now()}`,
      status: 'CONFIRMED',
      subtotal: 500,
      taxAmount: 90,
      discountAmount: 0,
      shippingAmount: 50,
      totalAmount: 640,
      shippingAddress: {
        line1: '123 Main Street',
        line2: 'Apt 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India',
      },
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 2,
            unitPrice: products[0].price,
            gstRate: 18,
            totalPrice: products[0].price * 2 * 1.18,
          },
        ],
      },
    },
  });

  console.log('✅ Created sample order');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
