import "./Skeleton.css";

// ─────────────────────────────────────────────────────────────
//  BASE SKELETON BLOCK
//  Use for any custom skeleton shape
//  Example: <SkeletonBlock width="60%" height="14px" />
// ─────────────────────────────────────────────────────────────
export function SkeletonBlock({ width = "100%", height = "14px", radius = "6px", style = {} }) {
  return (
    <span
      className="skeleton"
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
//  PRODUCT CARD SKELETON
//  Use in Products page while loading
// ─────────────────────────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      {/* Image placeholder */}
      <span className="skeleton skeleton-card-img" />

      {/* Body */}
      <div className="skeleton-card-body">
        <span className="skeleton skeleton-card-cat"  />
        <span className="skeleton skeleton-card-name" />
        <span className="skeleton skeleton-card-rating" />
        <span className="skeleton skeleton-card-price" />
        <span className="skeleton skeleton-card-btn"  />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  PRODUCTS GRID SKELETON
//  Shows 8 card skeletons in a grid
//  Use: <ProductsGridSkeleton count={8} />
// ─────────────────────────────────────────────────────────────
export function ProductsGridSkeleton({ count = 8 }) {
  return (
    <div className="products-grid">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  SECTION HEADER SKELETON
//  Use above any product/category section
// ─────────────────────────────────────────────────────────────
export function SectionHeaderSkeleton() {
  return (
    <div className="skeleton-section-header">
      <span className="skeleton skeleton-tag"     />
      <span className="skeleton skeleton-title"   />
      <span className="skeleton skeleton-divider" />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  PRODUCT DETAIL SKELETON
//  Use in ProductDetail page while loading
// ─────────────────────────────────────────────────────────────
export function ProductDetailSkeleton() {
  return (
    <div className="skeleton-detail">

      {/* Left — image area */}
      <div className="skeleton-detail-left">
        <span className="skeleton skeleton-detail-main-img" />

        {/* Thumbnails */}
        <div className="skeleton-detail-thumbs">
          {[1,2,3,4].map((i) => (
            <span key={i} className="skeleton skeleton-detail-thumb" />
          ))}
        </div>
      </div>

      {/* Right — info area */}
      <div className="skeleton-detail-right">
        <span className="skeleton skeleton-detail-badge"   />
        <span className="skeleton skeleton-detail-title"   />
        <span className="skeleton skeleton-detail-title-2" />
        <span className="skeleton skeleton-detail-rating"  />
        <span className="skeleton skeleton-detail-price"   />
        <span className="skeleton skeleton-detail-desc-1"  />
        <span className="skeleton skeleton-detail-desc-2"  />
        <span className="skeleton skeleton-detail-desc-3"  />
        <span className="skeleton skeleton-detail-qty"     />

        {/* Action buttons */}
        <div className="skeleton-detail-btns">
          <span className="skeleton skeleton-detail-btn-1" />
          <span className="skeleton skeleton-detail-btn-2" />
        </div>
      </div>

    </div>
  );
}