import { productCountText } from '../data'
import { ProductImage } from './ProductImage'

export function BrandCollections({ brands, selectedId, onSelect }) {
  return (
    <section className="section" id="catalogs" aria-labelledby="catalogs-title">
      <p className="eyebrow">الكتالوجات</p>
      <h2 id="catalogs-title">ثلاث دور، تعبئة واحدة</h2>
      <div className="brand-grid">
        {brands.map((brand) => {
          const selected = selectedId === brand.id
          return (
            <button
              key={brand.id}
              type="button"
              className={selected ? 'brand-card is-selected' : 'brand-card'}
              aria-pressed={selected}
              onClick={() => onSelect(brand.id)}
            >
              <span className="brand-band">
                <ProductImage className={brand.id === 'gucci' ? 'photo-gucci' : undefined} src={brand.image} alt="" width="400" height="500" />
              </span>
              <span className="brand-copy">
                <span className="brand-title">{brand.name}</span>
                <span className="brand-line">{brand.line}</span>
                <span className="brand-count">{productCountText(brand.count)}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
