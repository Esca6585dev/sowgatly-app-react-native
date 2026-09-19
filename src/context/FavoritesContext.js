import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../config/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const json = await apiRequest('/favorites');
      setProducts(json.data || []);
    } catch (error) {
      console.error('Favorites API error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    } else {
      setProducts([]);
    }
  }, [isAuthenticated, refresh]);

  const isFavorite = useCallback(
    (productId) => products.some((p) => p.id === productId),
    [products]
  );

  const toggleFavorite = useCallback(async (product) => {
    const wasFavorite = products.some((p) => p.id === product.id);

    // Optimistic update so the heart icon flips immediately.
    setProducts((prev) =>
      wasFavorite ? prev.filter((p) => p.id !== product.id) : [product, ...prev]
    );

    try {
      await apiRequest('/favorites/toggle', {
        method: 'POST',
        body: { product_id: product.id },
      });
    } catch (error) {
      console.error('Favorite toggle error:', error);
      // Revert on failure.
      setProducts((prev) =>
        wasFavorite ? [product, ...prev] : prev.filter((p) => p.id !== product.id)
      );
    }
  }, [products]);

  const value = useMemo(
    () => ({ products, isLoading, isFavorite, toggleFavorite, refresh }),
    [products, isLoading, isFavorite, toggleFavorite, refresh]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
};
