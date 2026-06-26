import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services';

export function useProducts(params) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getAll(params),
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productService.getFeatured(),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
    fallbackData: [
      { id: '1', name: 'Wires & Cables', slug: 'wires-cables', sortOrder: 1 },
      { id: '2', name: 'Switches & Sockets', slug: 'switches-sockets', sortOrder: 2 },
      { id: '3', name: 'Circuit Breakers', slug: 'circuit-breakers', sortOrder: 3 },
      { id: '4', name: 'Distribution Boards', slug: 'distribution-boards', sortOrder: 4 },
      { id: '5', name: 'Fans & Lighting', slug: 'fans-lighting', sortOrder: 5 },
      { id: '6', name: 'Industrial Equipment', slug: 'industrial', sortOrder: 6 }
    ]
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug),
    enabled: !!slug,
  });
}
