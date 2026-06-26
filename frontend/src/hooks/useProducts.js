import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services';

export function useProducts(params) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await productService.getAll(params);
      return data.data;
    },
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await productService.getFeatured();
      return data.data;
    },
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await productService.getCategories();
      return data.data;
    },
  });
}

export function useProduct(slug) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await productService.getBySlug(slug);
      return data.data;
    },
    enabled: !!slug,
  });
}
