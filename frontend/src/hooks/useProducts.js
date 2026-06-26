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
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug),
    enabled: !!slug,
  });
}
