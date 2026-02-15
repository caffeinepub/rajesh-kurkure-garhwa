import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product } from '../types/product';
import { backendToUIProduct, uiToBackendProductData } from '../lib/productMapping';

const PRODUCTS_QUERY_KEY = ['products'];

/**
 * Custom hook for managing products with backend persistence via React Query
 */
export function useProducts() {
  const { actor, isFetching: isActorLoading } = useActor();
  const queryClient = useQueryClient();

  // Query: Fetch all products from backend
  const {
    data: products = [],
    isLoading,
    error: fetchError,
  } = useQuery<Product[]>({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      const backendProducts = await actor.getAllProducts();
      return backendProducts.map(backendToUIProduct);
    },
    enabled: !!actor && !isActorLoading,
  });

  // Mutation: Add product
  const addProductMutation = useMutation({
    mutationFn: async (product: Omit<Product, 'id'>) => {
      if (!actor) throw new Error('Backend actor not initialized');
      const backendData = uiToBackendProductData(product);
      const createdProduct = await actor.addProduct(
        backendData.name,
        backendData.pricePaise,
        backendData.image
      );
      return backendToUIProduct(createdProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Add product mutation error:', error);
      throw error;
    },
  });

  // Mutation: Update product
  const updateProductMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<Omit<Product, 'id'>>;
    }) => {
      if (!actor) throw new Error('Backend actor not initialized');

      // Find current product to merge updates
      const currentProduct = products.find((p) => p.id === id);
      if (!currentProduct) throw new Error('Product not found');

      const updatedProduct = { ...currentProduct, ...updates };
      const backendData = uiToBackendProductData(updatedProduct);

      const success = await actor.updateProduct(
        BigInt(id),
        backendData.name,
        backendData.pricePaise,
        backendData.image
      );

      if (!success) throw new Error('Failed to update product');
      return updatedProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Update product mutation error:', error);
      throw error;
    },
  });

  // Mutation: Delete product
  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Backend actor not initialized');
      const success = await actor.deleteProduct(BigInt(id));
      if (!success) throw new Error('Product not found');
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Delete product mutation error:', error);
      throw error;
    },
  });

  return {
    products,
    isLoading,
    error: fetchError,
    addProduct: async (product: Omit<Product, 'id'>) => {
      return addProductMutation.mutateAsync(product);
    },
    updateProduct: async (id: string, updates: Partial<Omit<Product, 'id'>>) => {
      return updateProductMutation.mutateAsync({ id, updates });
    },
    deleteProduct: async (id: string) => {
      return deleteProductMutation.mutateAsync(id);
    },
    isAddingProduct: addProductMutation.isPending,
    isUpdatingProduct: updateProductMutation.isPending,
    isDeletingProduct: deleteProductMutation.isPending,
  };
}
