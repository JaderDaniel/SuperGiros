import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { CatalogService } from '../../services/catalog.service';
import {FlipbookComponent} from '../flipbook/flipbook.component'
import { Product, CatalogItem, User } from '../../models/interfaces';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatMenuModule,
    MatBadgeModule,
    FlipbookComponent,
    MatTabsModule,
    MatDividerModule,
  ],
  template: `
    <div class="catalog-container">
      <!-- Header con información del usuario y controles -->
      <mat-toolbar class="catalog-header gradient-background">
        <div class="header-content">
          <div class="company-info">
            <mat-icon class="company-icon">business</mat-icon>
            <div class="company-text">
              <h2>Comercializadora del Atlántico</h2>
              <p>Catálogo de Productos y Servicios</p>
            </div>
          </div>
          
          <div class="user-controls">
            <div class="user-info" *ngIf="currentUser">
              <mat-icon>person</mat-icon>
              <span>Bienvenido, {{currentUser.name.firstname}}</span>
            </div>
            
            <!-- Botón prominente para alternar vista -->
            <button
              mat-raised-button
              color="accent"
              (click)="toggleFlipbookView()"
              class="view-toggle-btn prominent-button"
              title="Cambiar entre vista de cuadrícula y vista de libro"
            >
              <mat-icon>{{showFlipbook ? 'view_module' : 'auto_stories'}}</mat-icon>
              {{showFlipbook ? 'Vista Cuadrícula' : 'Vista Flipbook'}}
            </button>
            
            <button
              mat-icon-button
              [matMenuTriggerFor]="userMenu"
              class="user-menu-btn"
            >
              <mat-icon [matBadge]="catalogItems.length" matBadgeColor="accent">shopping_cart</mat-icon>
            </button>
            
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item (click)="refreshCatalog()">
                <mat-icon>refresh</mat-icon>
                <span>Actualizar Catálogo</span>
              </button>
              <button mat-menu-item (click)="downloadCatalog()">
                <mat-icon>download</mat-icon>
                <span>Descargar Catálogo</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Cerrar Sesión</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </mat-toolbar>

      <!-- Controles de filtros y búsqueda -->
      <div class="filters-section" *ngIf="!showFlipbook">
        <mat-card class="filters-card">
          <div class="filters-content">
            <!-- Búsqueda -->
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Buscar productos</mat-label>
              <input
                matInput
                [(ngModel)]="searchTerm"
                (input)="applyFilters()"
                placeholder="Busque por nombre, descripción o categoría"
              >
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>

            <!-- Filtro por categoría -->
            <mat-form-field appearance="outline">
              <mat-label>Categoría</mat-label>
              <mat-select [(value)]="selectedCategory" (selectionChange)="applyFilters()">
                <mat-option value="">Todas las categorías</mat-option>
                <mat-option *ngFor="let category of categories" [value]="category">
                  {{category | titlecase}}
                </mat-option>
              </mat-select>
            </mat-form-field>

            <!-- Filtro de precio -->
            <div class="price-filter">
              <label>Rango de precio: \${{priceRange[0]}} - \${{priceRange[1]}}</label>
              <div class="price-inputs">
                <mat-form-field appearance="outline" class="price-input">
                  <mat-label>Mínimo</mat-label>
                  <input
                    matInput
                    type="number"
                    [(ngModel)]="priceRange[0]"
                    (input)="applyFilters()"
                    min="0"
                    max="2000"
                  >
                </mat-form-field>
                <mat-form-field appearance="outline" class="price-input">
                  <mat-label>Máximo</mat-label>
                  <input
                    matInput
                    type="number"
                    [(ngModel)]="priceRange[1]"
                    (input)="applyFilters()"
                    min="0"
                    max="2000"
                  >
                </mat-form-field>
              </div>
            </div>

            <!-- Ordenamiento -->
            <mat-form-field appearance="outline">
              <mat-label>Ordenar por</mat-label>
              <mat-select [(value)]="sortBy" (selectionChange)="applyFilters()">
                <mat-option value="name">Nombre</mat-option>
                <mat-option value="price">Precio</mat-option>
                <mat-option value="rating">Calificación</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </mat-card>
      </div>

      <!-- Loading spinner -->
      <div class="loading-container" *ngIf="isLoading">
        <mat-spinner diameter="60"></mat-spinner>
        <p>Cargando catálogo...</p>
      </div>

      <!-- Vista de cuadrícula de productos -->
      <div class="catalog-grid" *ngIf="!isLoading && !showFlipbook">
        <div class="grid-header">
          <h3>
            Productos Disponibles
            <mat-chip-listbox>
              <mat-chip>{{filteredProducts.length}} productos</mat-chip>
            </mat-chip-listbox>
          </h3>
        </div>

        <mat-grid-list [cols]="getGridCols()" rowHeight="400" gutterSize="20">
          <mat-grid-tile *ngFor="let item of filteredProducts; trackBy: trackByProductId">
            <mat-card class="product-card fade-in">
              <div class="product-image-container">
                <img
                  [src]="showBase64Images && item.imageBase64 ? item.imageBase64 : item.image"
                  [alt]="item.title"
                  class="product-image"
                  (error)="onImageError($event, item)"
                >
                <div class="image-overlay">
                  <button
                    mat-icon-button
                    (click)="toggleImageFormat(item)"
                    class="image-toggle-btn"
                  >
                    <mat-icon>{{showBase64Images ? 'cloud' : 'storage'}}</mat-icon>
                  </button>
                </div>
              </div>
              
              <mat-card-content class="product-content">
                <h3 class="product-title">{{item.title | slice:0:50}}{{item.title.length > 50 ? '...' : ''}}</h3>
                <p class="product-description">{{item.description | slice:0:100}}{{item.description.length > 100 ? '...' : ''}}</p>
                
                <div class="product-details">
                  <div class="price-rating">
                    <span class="product-price">\${{item.price | number:'1.2-2'}}</span>
                    <div class="product-rating">
                      <mat-icon class="star-icon">star</mat-icon>
                      <span>{{item.rating}}</span>
                    </div>
                  </div>
                  
                  <mat-chip class="category-chip">{{item.category | titlecase}}</mat-chip>
                </div>
              </mat-card-content>
              
              <mat-card-actions class="product-actions">
                <button mat-button color="primary" (click)="viewProduct(item)">
                  <mat-icon>visibility</mat-icon>
                  Ver Detalles
                </button>
                <button mat-raised-button color="accent" (click)="addToCart(item)">
                  <mat-icon>add_shopping_cart</mat-icon>
                  Agregar
                </button>
              </mat-card-actions>
            </mat-card>
          </mat-grid-tile>
        </mat-grid-list>
        
        <div class="no-results" *ngIf="filteredProducts.length === 0 && !isLoading">
          <mat-icon class="no-results-icon">search_off</mat-icon>
          <h3>No se encontraron productos</h3>
          <p>Intente modificar los filtros de búsqueda</p>
          <button mat-raised-button color="primary" (click)="clearFilters()">
            Limpiar Filtros
          </button>
        </div>
      </div>

      <!-- Vista Flipbook -->
      <div class="flipbook-section" *ngIf="!isLoading && showFlipbook">
        <app-flipbook
          [items]="catalogItems"
          [showBase64Images]="showBase64Images"
          (pageChanged)="onFlipbookPageChanged($event)"
          (itemSelected)="viewProduct($event)"
        ></app-flipbook>
      </div>
    </div>
  `,
  styles: [
    `
    .catalog-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .catalog-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      min-height: 80px;
      padding: 10px 0;
    }

    .header-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
    }

    .company-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .company-icon {
      font-size: 2rem;
      width: 2rem;
      height: 2rem;
      color: white;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
    }

    .company-text h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 500;
      color: white;
      text-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }

    .company-text p {
      margin: 0;
      color: rgba(255,255,255,0.95);
      font-size: 0.9rem;
      text-shadow: 0 1px 2px rgba(0,0,0,0.2);
    }

    .user-controls {
      display: flex;
      align-items: center;
      gap: 25px;
      flex-wrap: nowrap;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: rgba(255,255,255,0.25);
      border-radius: 25px;
      font-size: 0.9rem;
      color: white;
      border: 1px solid rgba(255,255,255,0.4);
      font-weight: 500;
      backdrop-filter: blur(5px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .view-toggle-btn {
      background: #ffffff !important;
      color: #2d3748 !important;
      font-weight: 700 !important;
      border: 2px solid rgba(255,255,255,0.8) !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
      padding: 8px 20px !important;
      font-size: 0.95rem !important;
      border-radius: 24px !important;
      text-transform: none !important;
      letter-spacing: 0.5px !important;
      backdrop-filter: blur(10px) !important;
      transition: all 0.3s ease !important;
    }

    .view-toggle-btn:hover {
      background: #f8f9ff !important;
      color: #1a202c !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 6px 20px rgba(0,0,0,0.25) !important;
      border-color: #667eea !important;
    }

    .view-toggle-btn mat-icon {
      margin-right: 8px !important;
      font-size: 1.2rem !important;
      width: 1.2rem !important;
      height: 1.2rem !important;
    }

    .prominent-button {
      position: relative;
      overflow: visible !important;
      z-index: 10;
    }

    .prominent-button::before {
      content: '';
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
      border-radius: 27px;
      z-index: -1;
      animation: glow 2s ease-in-out infinite alternate;
    }

    @keyframes glow {
      from {
        box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
      }
      to {
        box-shadow: 0 0 20px rgba(102, 126, 234, 0.8), 0 0 30px rgba(118, 75, 162, 0.4);
      }
    }

    .filters-section {
      padding: 20px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }

    .filters-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .filters-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 20px;
      align-items: end;
      padding: 20px;
    }

    .search-field {
      min-width: 300px;
    }

    .price-filter {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .price-filter label {
      font-size: 0.9rem;
      color: #2d3748;
      font-weight: 600;
    }

    .price-inputs {
      display: flex;
      gap: 10px;
    }

    .price-input {
      flex: 1;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 100px;
      gap: 20px;
      background: white;
      border-radius: 12px;
      margin: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .loading-container p {
      font-size: 1.2rem;
      color: #4a5568;
      font-weight: 500;
    }

    .catalog-grid {
      padding: 20px;
      background: #f8f9fa;
    }

    .grid-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 0 5px;
    }

    .grid-header h3 {
      display: flex;
      align-items: center;
      gap: 15px;
      color: #1a202c;
      font-weight: 600;
      font-size: 1.4rem;
    }

    .product-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      cursor: pointer;
      background: white;
      border-radius: 12px;
      border: 1px solid rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      border-color: rgba(102, 126, 234, 0.3);
    }

    .product-image-container {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .image-overlay {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.8);
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    .image-toggle-btn {
      color: white;
    }

    .product-content {
      flex: 1;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .product-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1a202c;
      line-height: 1.3;
    }

    .product-description {
      margin: 0;
      color: #4a5568;
      font-size: 0.9rem;
      line-height: 1.4;
      flex: 1;
    }

    .product-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: 8px;
      border-top: 1px solid rgba(0,0,0,0.08);
    }

    .price-rating {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .product-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: #38a169;
    }

    .product-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #ed8936;
    }

    .star-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    .category-chip {
      background: #ebf8ff;
      color: #2b6cb0;
      font-weight: 600;
      border: 1px solid rgba(43, 108, 176, 0.2);
    }

    .product-actions {
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      background: #f7fafc;
      border-top: 1px solid rgba(0,0,0,0.08);
    }

    .product-actions button {
      font-weight: 600;
      text-transform: none;
      border-radius: 8px;
    }

    .product-actions .mat-mdc-button {
      color: #2b6cb0;
    }

    .product-actions .mat-mdc-raised-button {
      background: #667eea;
      color: white;
    }

    .no-results {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 12px;
      margin: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .no-results h3 {
      color: #2d3748;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .no-results p {
      color: #4a5568;
      margin-bottom: 20px;
    }

    .no-results-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 20px;
      color: #a0aec0;
    }

    .flipbook-section {
      padding: 40px 20px;
      min-height: 70vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: white;
      border-radius: 12px;
      margin: 20px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
      .filters-content {
        grid-template-columns: 1fr 1fr;
        gap: 15px;
      }
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 15px;
        padding: 15px 10px;
      }

      .company-info {
        flex-direction: column;
        text-align: center;
      }

      .user-controls {
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
      }

      .view-toggle-btn {
        min-width: 180px !important;
        padding: 12px 24px !important;
        font-size: 1rem !important;
        order: -1; /* Hacer que aparezca primero en móviles */
      }

      .user-info {
        order: 1;
      }

      .user-menu-btn {
        order: 2;
      }

      .filters-content {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .search-field {
        min-width: auto;
      }

      .catalog-grid {
        padding: 10px;
      }

      .grid-header {
        flex-direction: column;
        gap: 10px;
        text-align: center;
      }

      .grid-header h3 {
        font-size: 1.2rem;
      }

      .product-content {
        padding: 12px;
      }

      .product-actions {
        padding: 10px 12px;
        flex-direction: column;
        gap: 8px;
      }
    }

    /* Additional Material Design overrides for better contrast */
    ::ng-deep .mat-mdc-form-field-appearance-outline .mat-mdc-form-field-outline {
      color: rgba(0, 0, 0, 0.2) !important;
    }

    ::ng-deep .mat-mdc-form-field-appearance-outline.mat-focused .mat-mdc-form-field-outline-thick {
      color: #667eea !important;
    }

    ::ng-deep .mat-mdc-form-field .mat-mdc-floating-label {
      color: #4a5568 !important;
    }

    ::ng-deep .mat-mdc-form-field.mat-focused .mat-mdc-floating-label {
      color: #667eea !important;
    }

    ::ng-deep .mat-mdc-input-element {
      color: #2d3748 !important;
    }

    ::ng-deep .mat-mdc-input-element::placeholder {
      color: #9ca3af !important;
    }

    ::ng-deep .mat-mdc-select-value {
      color: #2d3748 !important;
    }

    ::ng-deep .mat-chip {
      font-weight: 600 !important;
    }
  `,
  ],
})
export class CatalogComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // State
  isLoading = true;
  currentUser: User | null = null;
  products: Product[] = [];
  catalogItems: CatalogItem[] = [];
  filteredProducts: CatalogItem[] = [];
  categories: string[] = [];
  showFlipbook = false;
  showBase64Images = false;

  // Filters
  searchTerm = '';
  selectedCategory = '';
  priceRange = [0, 2000];
  sortBy: 'name' | 'price' | 'rating' = 'name';

  constructor(
    private authService: AuthService,
    private catalogService: CatalogService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadCatalogData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Cargar datos del usuario actual
   */
  private loadUserData(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.currentUser = user;
      });
  }

  /**
   * Cargar datos del catálogo
   */
  private loadCatalogData(): void {
    this.isLoading = true;

    // Cargar categorías
    this.catalogService
      .getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe((categories) => {
        this.categories = categories;
      });

    // Cargar productos
    this.catalogService
      .getProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products) => {
          this.products = products;
          this.catalogItems =
            this.catalogService.convertProductsToCatalogItems(products);

          // Convertir imágenes a Base64 para usuarios autenticados
          if (this.authService.isAuthenticated()) {
            this.catalogService
              .storeImagesAsBase64(this.catalogItems)
              .pipe(takeUntil(this.destroy$))
              .subscribe({
                next: (itemsWithBase64) => {
                  this.catalogItems = itemsWithBase64;
                  this.applyFilters();
                  this.isLoading = false;
                },
                error: (error) => {
                  console.error('Error converting images to Base64:', error);
                  this.applyFilters();
                  this.isLoading = false;
                },
              });
          } else {
            this.applyFilters();
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Error loading catalog:', error);
          this.isLoading = false;
          this.snackBar.open('Error al cargar el catálogo', 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
  }

  /**
   * Aplicar filtros de búsqueda y ordenamiento
   */
  applyFilters(): void {
    let filtered = [...this.catalogItems];

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          item.category.toLowerCase().includes(term)
      );
    }

    // Filtro por categoría
    if (this.selectedCategory) {
      filtered = filtered.filter(
        (item) => item.category === this.selectedCategory
      );
    }

    // Filtro por precio
    filtered = filtered.filter(
      (item) =>
        item.price >= this.priceRange[0] && item.price <= this.priceRange[1]
    );

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    this.filteredProducts = filtered;
  }

  /**
   * Limpiar todos los filtros
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.priceRange = [0, 2000];
    this.sortBy = 'name';
    this.applyFilters();
  }

  /**
   * Alternar entre vista flipbook y cuadrícula
   */
  toggleFlipbookView(): void {
    this.showFlipbook = !this.showFlipbook;
  }

  /**
   * Alternar formato de imagen (URL vs Base64)
   */
  toggleImageFormat(item?: CatalogItem): void {
    if (this.authService.isAuthenticated()) {
      this.showBase64Images = !this.showBase64Images;

      if (item) {
        this.snackBar.open(
          `Mostrando imagen ${this.showBase64Images ? 'Base64' : 'URL'} para ${
            item.title
          }`,
          'Cerrar',
          { duration: 2000 }
        );
      }
    } else {
      this.snackBar.open(
        'Debe estar autenticado para ver imágenes Base64',
        'Cerrar',
        { duration: 3000 }
      );
    }
  }

  /**
   * Obtener número de columnas según el tamaño de pantalla
   */
  getGridCols(): number {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1200) return 2;
    if (width < 1600) return 3;
    return 4;
  }

  /**
   * Track function para ngFor optimization
   */
  trackByProductId(index: number, item: CatalogItem): number {
    return item.id;
  }

  /**
   * Manejar error de carga de imagen
   */
  onImageError(event: any, item: CatalogItem): void {
    console.error(`Error loading image for product ${item.id}:`, event);
    // Usar imagen placeholder
    event.target.src =
      'https://via.placeholder.com/300x200?text=Imagen+no+disponible';
  }

  /**
   * Ver detalles del producto
   */
  viewProduct(item: CatalogItem): void {
    this.snackBar.open(`Viendo detalles de: ${item.title}`, 'Cerrar', {
      duration: 3000,
    });
    // Aquí se podría navegar a una página de detalles del producto
  }

  /**
   * Agregar producto al carrito
   */
  addToCart(item: CatalogItem): void {
    this.snackBar.open(`${item.title} agregado al carrito`, 'Cerrar', {
      duration: 2000,
      panelClass: ['success-snackbar'],
    });
  }

  /**
   * Actualizar catálogo
   */
  refreshCatalog(): void {
    this.loadCatalogData();
    this.snackBar.open('Catálogo actualizado', 'Cerrar', {
      duration: 2000,
      panelClass: ['success-snackbar'],
    });
  }

  /**
   * Descargar catálogo (simulado)
   */
  downloadCatalog(): void {
    const catalogData = JSON.stringify(this.catalogItems, null, 2);
    const blob = new Blob([catalogData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'catalogo-productos.json';
    link.click();
    window.URL.revokeObjectURL(url);

    this.snackBar.open('Catálogo descargado', 'Cerrar', {
      duration: 2000,
      panelClass: ['success-snackbar'],
    });
  }

  /**
   * Manejar cambio de página en flipbook
   */
  onFlipbookPageChanged(pageNumber: number): void {
    console.log(`Flipbook page changed to: ${pageNumber}`);
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.snackBar.open('Sesión cerrada exitosamente', 'Cerrar', {
      duration: 2000,
    });
  }
}
