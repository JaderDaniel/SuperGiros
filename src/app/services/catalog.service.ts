import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Product, CatalogItem, FlipbookPage } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private readonly API_URL = 'https://fakestoreapi.com';
  private readonly STORAGE_KEY = 'catalog_items';
  private readonly IMAGES_STORAGE_KEY = 'catalog_images_base64';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todos los productos desde la API
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products`)
      .pipe(
        tap(products => {
          // Almacenar productos en localStorage para persistencia
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
        }),
        catchError(error => {
          console.error('Error fetching products:', error);
          // Fallback: devolver productos desde localStorage si existe
          const storedProducts = localStorage.getItem(this.STORAGE_KEY);
          if (storedProducts) {
            return of(JSON.parse(storedProducts));
          }
          // Fallback final: productos mock
          return of(this.getMockProducts());
        })
      );
  }

  /**
   * Obtener productos por categoría
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products/category/${category}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching products by category:', error);
          return this.getProducts().pipe(
            map(products => products.filter(p => p.category === category))
          );
        })
      );
  }

  /**
   * Obtener categorías disponibles
   */
  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/products/categories`)
      .pipe(
        catchError(error => {
          console.error('Error fetching categories:', error);
          return of(['electronics', 'jewelery', 'men\'s clothing', 'women\'s clothing']);
        })
      );
  }

  /**
   * Convertir productos a items de catálogo
   */
  convertProductsToCatalogItems(products: Product[]): CatalogItem[] {
    return products.map(product => ({
      id: product.id,
      title: product.title,
      description: product.description,
      image: product.image,
      category: product.category,
      price: product.price,
      rating: product.rating.rate
    }));
  }

  /**
   * Generar páginas para flipbook
   */
  generateFlipbookPages(items: CatalogItem[]): FlipbookPage[] {
    const pages: FlipbookPage[] = [];
    
    for (let i = 0; i < items.length; i += 2) {
      const frontItem = items[i];
      const backItem = items[i + 1];
      
      pages.push({
        id: i / 2 + 1,
        frontContent: frontItem,
        backContent: backItem,
        isFlipped: false
      });
    }
    
    return pages;
  }

  /**
   * Convertir imagen a Base64
   */
  async convertImageToBase64(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  }

  /**
   * Almacenar imágenes en Base64
   */
  storeImagesAsBase64(items: CatalogItem[]): Observable<CatalogItem[]> {
    const storedImages = this.getStoredBase64Images();
    
    const imagePromises = items.map(async (item) => {
      // Verificar si ya tenemos la imagen almacenada
      if (storedImages[item.id]) {
        item.imageBase64 = storedImages[item.id];
        return item;
      }

      try {
        const base64Image = await this.convertImageToBase64(item.image);
        item.imageBase64 = base64Image;
        storedImages[item.id] = base64Image;
        return item;
      } catch (error) {
        console.error(`Error converting image for product ${item.id}:`, error);
        return item;
      }
    });

    return forkJoin(imagePromises).pipe(
      tap(() => {
        // Guardar imágenes en localStorage
        localStorage.setItem(this.IMAGES_STORAGE_KEY, JSON.stringify(storedImages));
      })
    );
  }

  /**
   * Obtener imágenes Base64 almacenadas
   */
  private getStoredBase64Images(): {[key: number]: string} {
    const stored = localStorage.getItem(this.IMAGES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  /**
   * Productos mock para fallback
   */
  private getMockProducts(): Product[] {
    return [
      {
        id: 1,
        title: "Laptop Empresarial Dell OptiPlex",
        price: 899.99,
        description: "Laptop empresarial de alta gama con procesador Intel Core i7, 16GB RAM y SSD de 512GB. Ideal para profesionales y empresas.",
        category: "electronics",
        image: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg",
        rating: { rate: 4.5, count: 120 }
      },
      {
        id: 2,
        title: "Sistema de Videoconferencias HD",
        price: 1299.99,
        description: "Sistema completo de videoconferencias con cámara 4K, micrófono direccional y altavoces de alta calidad.",
        category: "electronics",
        image: "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg",
        rating: { rate: 4.8, count: 89 }
      },
      {
        id: 3,
        title: "Impresora Multifunción Láser",
        price: 299.99,
        description: "Impresora láser multifunción con escáner, copiadora y conexión WiFi. Perfecta para oficinas pequeñas y medianas.",
        category: "electronics",
        image: "https://images.pexels.com/photos/4439901/pexels-photo-4439901.jpeg",
        rating: { rate: 4.3, count: 156 }
      },
      {
        id: 4,
        title: "Software de Gestión Empresarial",
        price: 1999.99,
        description: "Suite completa de software para gestión empresarial: CRM, ERP, contabilidad y recursos humanos.",
        category: "software",
        image: "https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg",
        rating: { rate: 4.7, count: 78 }
      },
      {
        id: 5,
        title: "Servicio de Consultoría IT",
        price: 150.00,
        description: "Servicios profesionales de consultoría en tecnología de la información para optimizar sus procesos empresariales.",
        category: "services",
        image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
        rating: { rate: 4.9, count: 45 }
      },
      {
        id: 6,
        title: "Router Empresarial Cisco",
        price: 549.99,
        description: "Router empresarial de alta velocidad con múltiples puertos Ethernet y tecnología WiFi 6.",
        category: "electronics",
        image: "https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg",
        rating: { rate: 4.4, count: 203 }
      }
    ];
  }

  /**
   * Buscar productos por término
   */
  searchProducts(searchTerm: string, products: Product[]): Product[] {
    if (!searchTerm.trim()) {
      return products;
    }
    
    const term = searchTerm.toLowerCase();
    return products.filter(product => 
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  }

  /**
   * Filtrar productos por rango de precio
   */
  filterProductsByPrice(products: Product[], minPrice: number, maxPrice: number): Product[] {
    return products.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );
  }

  /**
   * Ordenar productos
   */
  sortProducts(products: Product[], sortBy: 'price' | 'rating' | 'name', order: 'asc' | 'desc' = 'asc'): Product[] {
    return products.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating.rate - b.rating.rate;
          break;
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      return order === 'asc' ? comparison : -comparison;
    });
  }
}