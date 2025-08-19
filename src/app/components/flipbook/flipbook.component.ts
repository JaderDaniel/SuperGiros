import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CatalogItem, FlipbookPage } from '../../models/interfaces';

@Component({
  selector: 'app-flipbook',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule
  ],
  template: `
    <div class="flipbook-container">
      <div class="flipbook-header">
        <h2>Catálogo Interactivo</h2>
        <div class="flipbook-navigation">
          <button
            mat-icon-button
            (click)="previousPage()"
            [disabled]="currentPageIndex === 0"
            class="nav-button"
          >
            <mat-icon>chevron_left</mat-icon>
          </button>
          
          <div class="page-indicator">
            <mat-chip>
              Página {{currentPageIndex + 1}} de {{flipbookPages.length}}
            </mat-chip>
          </div>
          
          <button
            mat-icon-button
            (click)="nextPage()"
            [disabled]="currentPageIndex === flipbookPages.length - 1"
            class="nav-button"
          >
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </div>

      <div class="flipbook-content" *ngIf="flipbookPages.length > 0">
        <div class="flipbook-page-container">
          <!-- Página actual -->
          <div
            class="flipbook-page"
            [class.flipped]="currentPage?.isFlipped"
            (click)="flipPage()"
          >
            <!-- Frente de la página -->
            <div class="page-front">
              <mat-card class="product-flipbook-card">
                <div class="flipbook-image-container">
                  <img
                    [src]="getImageSource(currentPage?.frontContent)"
                    [alt]="currentPage?.frontContent?.title"
                    class="flipbook-image"
                    (error)="onImageError($event)"
                  >
                  <div class="image-format-badge" *ngIf="showBase64Images && currentPage?.frontContent?.imageBase64">
                    <mat-chip color="accent">Base64</mat-chip>
                  </div>
                </div>
                
                <mat-card-content class="flipbook-content-area">
                  <h3 class="flipbook-title">{{currentPage?.frontContent?.title}}</h3>
                  <p class="flipbook-description">
                    {{currentPage?.frontContent?.description | slice:0:120}}
                    {{(currentPage?.frontContent?.description?.length || 0) > 120 ? '...' : ''}}
                  </p>
                  
                  <div class="flipbook-details">
                    <div class="price-section">
                      <span class="flipbook-price">\${{currentPage?.frontContent?.price | number:'1.2-2'}}</span>
                      <div class="flipbook-rating">
                        <mat-icon class="star-icon">star</mat-icon>
                        <span>{{currentPage?.frontContent?.rating}}</span>
                      </div>
                    </div>
                    <mat-chip class="flipbook-category">
                      {{currentPage?.frontContent?.category | titlecase}}
                    </mat-chip>
                  </div>
                </mat-card-content>
                
                <mat-card-actions class="flipbook-actions">
                  <button
                    mat-raised-button
                    color="primary"
                    (click)="selectItem(currentPage?.frontContent, $event)"
                  >
                    <mat-icon>visibility</mat-icon>
                    Ver Detalles
                  </button>
                  <small class="flip-hint">Haz clic en la página para voltear</small>
                </mat-card-actions>
              </mat-card>
            </div>

            <!-- Reverso de la página -->
            <div class="page-back" *ngIf="currentPage?.backContent">
              <mat-card class="product-flipbook-card">
                <div class="flipbook-image-container">
                  <img
                    [src]="getImageSource(currentPage?.backContent)"
                    [alt]="currentPage?.backContent?.title"
                    class="flipbook-image"
                    (error)="onImageError($event)"
                  >
                  <div class="image-format-badge" *ngIf="showBase64Images && currentPage?.backContent?.imageBase64">
                    <mat-chip color="accent">Base64</mat-chip>
                  </div>
                </div>
                
                <mat-card-content class="flipbook-content-area">
                  <h3 class="flipbook-title">{{currentPage?.backContent?.title}}</h3>
                  <p class="flipbook-description">
                    {{currentPage?.backContent?.description | slice:0:120}}
                    {{(currentPage?.backContent?.description?.length || 0) > 120 ? '...' : ''}}
                  </p>
                  
                  <div class="flipbook-details">
                    <div class="price-section">
                      <span class="flipbook-price">\${{currentPage?.backContent?.price | number:'1.2-2'}}</span>
                      <div class="flipbook-rating">
                        <mat-icon class="star-icon">star</mat-icon>
                        <span>{{currentPage?.backContent?.rating}}</span>
                      </div>
                    </div>
                    <mat-chip class="flipbook-category">
                      {{currentPage?.backContent?.category | titlecase}}
                    </mat-chip>
                  </div>
                </mat-card-content>
                
                <mat-card-actions class="flipbook-actions">
                  <button
                    mat-raised-button
                    color="primary"
                    (click)="selectItem(currentPage?.backContent, $event)"
                  >
                    <mat-icon>visibility</mat-icon>
                    Ver Detalles
                  </button>
                  <small class="flip-hint">Haz clic para volver</small>
                </mat-card-actions>
              </mat-card>
            </div>

            <!-- Mensaje para página simple sin reverso -->
            <div class="page-back page-back-empty" *ngIf="!currentPage?.backContent">
              <div class="empty-page-content">
                <mat-icon class="empty-page-icon">auto_stories</mat-icon>
                <p>Página en blanco</p>
                <small>Haz clic para volver al frente</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Controles de navegación adicionales -->
        <div class="flipbook-controls">
          <button
            mat-stroked-button
            (click)="resetFlip()"
            [disabled]="!currentPage?.isFlipped"
            class="reset-button"
          >
            <mat-icon>refresh</mat-icon>
            Volver al Frente
          </button>
          
          <div class="page-dots">
            <button
              *ngFor="let page of flipbookPages; let i = index"
              mat-mini-fab
              [color]="i === currentPageIndex ? 'accent' : ''"
              (click)="goToPage(i)"
              class="page-dot"
            >
              {{i + 1}}
            </button>
          </div>
          
          <button
            mat-stroked-button
            (click)="toggleImageFormat()"
            class="format-toggle"
          >
            <mat-icon>{{showBase64Images ? 'cloud' : 'storage'}}</mat-icon>
            {{showBase64Images ? 'URL' : 'Base64'}}
          </button>
        </div>
      </div>

      <!-- Mensaje cuando no hay elementos -->
      <div class="no-items-message" *ngIf="flipbookPages.length === 0">
        <mat-icon class="no-items-icon">library_books</mat-icon>
        <h3>No hay elementos en el catálogo</h3>
        <p>El catálogo flipbook estará disponible cuando se carguen los productos.</p>
      </div>
    </div>
  `,
  styles: [`
    .flipbook-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .flipbook-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .flipbook-header h2 {
      color: #333;
      font-weight: 300;
      margin: 0 0 20px 0;
    }

    .flipbook-navigation {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    .nav-button {
      background: #fff;
      border: 2px solid #ddd;
      width: 48px;
      height: 48px;
    }

    .nav-button:not(:disabled):hover {
      background: #f5f5f5;
      border-color: #ccc;
    }

    .page-indicator {
      min-width: 150px;
      text-align: center;
    }

    .flipbook-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
    }

    .flipbook-page-container {
      perspective: 1000px;
      display: flex;
      justify-content: center;
    }

    .flipbook-page {
      width: 400px;
      height: 600px;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.8s cubic-bezier(0.4, 0.0, 0.2, 1);
      cursor: pointer;
      margin: 20px;
    }

    .flipbook-page.flipped {
      transform: rotateY(180deg);
    }

    .page-front, .page-back {
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .page-back {
      transform: rotateY(180deg);
    }

    .page-back-empty {
      background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .empty-page-content {
      text-align: center;
      color: #999;
    }

    .empty-page-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 15px;
    }

    .product-flipbook-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      background: white;
      border-radius: 16px;
      overflow: hidden;
    }

    .flipbook-image-container {
      position: relative;
      height: 250px;
      overflow: hidden;
    }

    .flipbook-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .flipbook-page:hover .flipbook-image {
      transform: scale(1.05);
    }

    .image-format-badge {
      position: absolute;
      top: 10px;
      right: 10px;
    }

    .flipbook-content-area {
      flex: 1;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .flipbook-title {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 500;
      color: #333;
      line-height: 1.4;
    }

    .flipbook-description {
      margin: 0;
      color: #666;
      line-height: 1.6;
      flex: 1;
    }

    .flipbook-details {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: auto;
    }

    .price-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .flipbook-price {
      font-size: 1.4rem;
      font-weight: bold;
      color: #4caf50;
    }

    .flipbook-rating {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #ff9800;
    }

    .star-icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }

    .flipbook-category {
      background: #e3f2fd;
      color: #1976d2;
    }

    .flipbook-actions {
      padding: 20px;
      background: #fafafa;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .flip-hint {
      color: #999;
      font-style: italic;
    }

    .flipbook-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 600px;
      padding: 20px;
      background: rgba(255,255,255,0.9);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .page-dots {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .page-dot {
      width: 40px;
      height: 40px;
      min-height: 40px;
      font-size: 0.9rem;
    }

    .reset-button, .format-toggle {
      min-width: 120px;
    }

    .no-items-message {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-items-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .flipbook-container {
        padding: 10px;
      }

      .flipbook-page {
        width: 300px;
        height: 480px;
        margin: 10px;
      }

      .flipbook-image-container {
        height: 180px;
      }

      .flipbook-content-area {
        padding: 15px;
        gap: 10px;
      }

      .flipbook-title {
        font-size: 1.1rem;
      }

      .flipbook-price {
        font-size: 1.2rem;
      }

      .flipbook-controls {
        flex-direction: column;
        gap: 15px;
        padding: 15px;
      }

      .page-dots {
        order: 1;
      }

      .reset-button, .format-toggle {
        order: 2;
        min-width: 100px;
      }
    }

    @media (max-width: 480px) {
      .flipbook-navigation {
        flex-wrap: wrap;
        gap: 10px;
      }

      .page-indicator {
        min-width: auto;
      }

      .flipbook-page {
        width: 280px;
        height: 420px;
      }

      .flipbook-actions {
        flex-direction: column;
        gap: 10px;
        text-align: center;
      }
    }
  `]
})
export class FlipbookComponent implements OnInit, OnChanges {
  @Input() items: CatalogItem[] = [];
  @Input() showBase64Images: boolean = false;
  @Output() pageChanged = new EventEmitter<number>();
  @Output() itemSelected = new EventEmitter<CatalogItem>();

  flipbookPages: FlipbookPage[] = [];
  currentPageIndex: number = 0;
  currentPage?: FlipbookPage;

  ngOnInit(): void {
    this.generateFlipbookPages();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.items.length > 0) {
      this.generateFlipbookPages();
    }
    
    if (changes['showBase64Images']) {
      // Re-render cuando cambie el formato de imagen
      this.updateCurrentPage();
    }
  }

  /**
   * Generar páginas del flipbook a partir de los items
   */
  private generateFlipbookPages(): void {
    this.flipbookPages = [];
    
    for (let i = 0; i < this.items.length; i += 2) {
      const frontItem = this.items[i];
      const backItem = this.items[i + 1];
      
      this.flipbookPages.push({
        id: Math.floor(i / 2) + 1,
        frontContent: frontItem,
        backContent: backItem,
        isFlipped: false
      });
    }

    // Establecer página actual
    this.currentPageIndex = 0;
    this.updateCurrentPage();
  }

  /**
   * Actualizar referencia a la página actual
   */
  private updateCurrentPage(): void {
    this.currentPage = this.flipbookPages[this.currentPageIndex];
  }

  /**
   * Obtener fuente de imagen según configuración
   */
  getImageSource(item?: CatalogItem): string {
    if (!item) return '';
    
    if (this.showBase64Images && item.imageBase64) {
      return item.imageBase64;
    }
    
    return item.image;
  }

  /**
   * Voltear página actual
   */
  flipPage(): void {
    if (this.currentPage) {
      this.currentPage.isFlipped = !this.currentPage.isFlipped;
    }
  }

  /**
   * Ir a página anterior
   */
  previousPage(): void {
    if (this.currentPageIndex > 0) {
      this.currentPageIndex--;
      this.updateCurrentPage();
      this.resetCurrentPageFlip();
      this.pageChanged.emit(this.currentPageIndex);
    }
  }

  /**
   * Ir a página siguiente
   */
  nextPage(): void {
    if (this.currentPageIndex < this.flipbookPages.length - 1) {
      this.currentPageIndex++;
      this.updateCurrentPage();
      this.resetCurrentPageFlip();
      this.pageChanged.emit(this.currentPageIndex);
    }
  }

  /**
   * Ir a página específica
   */
  goToPage(pageIndex: number): void {
    if (pageIndex >= 0 && pageIndex < this.flipbookPages.length) {
      this.currentPageIndex = pageIndex;
      this.updateCurrentPage();
      this.resetCurrentPageFlip();
      this.pageChanged.emit(this.currentPageIndex);
    }
  }

  /**
   * Resetear flip de la página actual
   */
  resetFlip(): void {
    this.resetCurrentPageFlip();
  }

  /**
   * Resetear flip de página actual
   */
  private resetCurrentPageFlip(): void {
    if (this.currentPage) {
      this.currentPage.isFlipped = false;
    }
  }

  /**
   * Alternar formato de imagen
   */
  toggleImageFormat(): void {
    this.showBase64Images = !this.showBase64Images;
  }

  /**
   * Seleccionar item (emitir evento)
   */
  selectItem(item?: CatalogItem, event?: Event): void {
    if (event) {
      event.stopPropagation(); // Prevenir que se active el flip
    }
    
    if (item) {
      this.itemSelected.emit(item);
    }
  }

  /**
   * Manejar error de carga de imagen
   */
  onImageError(event: any): void {
    event.target.src = 'https://via.placeholder.com/400x250?text=Imagen+no+disponible';
  }
}