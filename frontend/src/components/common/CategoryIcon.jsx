import {
  Cable,
  ToggleRight,
  ShieldCheck,
  LayoutGrid,
  Lightbulb,
  Factory,
  Zap,
} from 'lucide-react';
import { CATEGORY_ICON_MAP } from '@/constants/categories';

const ICONS = {
  Cable,
  ToggleRight,
  ShieldCheck,
  LayoutGrid,
  Lightbulb,
  Factory,
  Zap,
};

export default function CategoryIcon({ slug, size = 'md', showImage, image, name }) {
  const config = CATEGORY_ICON_MAP[slug] || { icon: 'Zap', color: 'from-primary-500 to-primary-700', bg: 'bg-primary-50' };
  const Icon = ICONS[config.icon] || Zap;

  const sizes = {
    sm: { wrap: 'h-12 w-12', icon: 'h-5 w-5' },
    md: { wrap: 'h-16 w-16', icon: 'h-7 w-7' },
    lg: { wrap: 'h-20 w-20', icon: 'h-9 w-9' },
    xl: { wrap: 'h-28 w-28', icon: 'h-10 w-10' },
  };
  const s = sizes[size] || sizes.md;

  if (image) {
    return (
      <div className={`relative ${s.wrap} overflow-hidden rounded-2xl shadow-md`}>
        <img src={image} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`flex ${s.wrap} items-center justify-center rounded-2xl bg-gradient-to-br ${config.color} shadow-md`}>
      <Icon className={`${s.icon} text-white drop-shadow`} strokeWidth={1.75} />
    </div>
  );
}
