import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import CategoryIcon from '@/components/common/CategoryIcon';

const CATEGORY_IMAGES = {
  'wires-cables': '/images/categories/wires.jpg',
  'switches-sockets': '/images/categories/switches.jpg',
  'circuit-breakers': '/images/categories/breakers.jpg',
  'distribution-boards': '/images/categories/panels.jpg',
  'fans-lighting': '/images/categories/lighting.jpg',
  industrial: '/images/categories/industrial.jpg',
};

export default function CategoryCard({ category, index = 0, variant = 'grid' }) {
  const cat = {
    ...category,
    image: category.image || CATEGORY_IMAGES[category.slug] || '/images/categories/wires.jpg',
  };
  const href = `/shop?category=${encodeURIComponent(cat.id)}`;

  if (variant === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.06 }}
      >
        <Link to={href} className="group relative block overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover">
          <div className="aspect-[4/3]">
            <img
              src={cat.image}
              alt={cat.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="font-semibold">{cat.name}</h3>
                <p className="text-xs text-white/70">{cat.count || 0}+ products</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 opacity-0 transition group-hover:opacity-100">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        to={href}
        className="card-hover group flex flex-col items-center p-5 text-center sm:p-6"
      >
        <CategoryIcon
          slug={cat.slug}
          size="lg"
          image={cat.image}
          name={cat.name}
        />
        <h3 className="mt-4 text-sm font-semibold text-slate-800 group-hover:text-primary-700">
          {cat.name}
        </h3>
        <p className="mt-1 text-xs text-slate-400">{cat.count || 0} products</p>
      </Link>
    </motion.div>
  );
}
