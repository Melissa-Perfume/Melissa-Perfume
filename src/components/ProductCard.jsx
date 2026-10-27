import { brands, formatPrice, originalPrice, productImage, sizeOptions } from '../data'
import { ProductImage } from './ProductImage'

export function ProductCard({ product, size, onSize, onAdd, added }) {
  const brand = brands.find((item) => item.id === product.brand)
  const selling = product.prices[size]
  const previous = originalPrice(selling)

  return (
    <article className="product-card">
      <div className={`product-swatch swatch-${product.brand}`}>
        <ProductImage className={product.brand === 'gucci' ? 'photo-gucci' : undefined} src={productImage(product)} alt="" width="400" height="500" />
      </div>
      <div className="product-body">
        <p className="product-brand">{brand.name}</p>
        <h3>{product.name}</h3>
        <p className="product-note">{product.note}</p>
        <p className="compare-note">قبل: السعر السابق. الآن: سعر البيع.</p>
        <div className="size-row" role="group" aria-label={`مقارنة أحجام ${product.name}`}>
          {sizeOptions.map((option) => {
            const optionSelling = product.prices[option.id]
            const optionPrevious = originalPrice(optionSelling)
            const selected = size === option.id
            return (
              <button
                key={option.id}
                type="button"
                className="size-btn"
                aria-pressed={selected}
                aria-label={`${option.label}، السعر السابق ${formatPrice(optionPrevious)}، سعر البيع ${formatPrice(optionSelling)}`}
                onClick={() => onSize(option.id)}
              >
                <span className="size-name">{option.label}</span>
                <span className="was">
                  <span className="price-tag">قبل</span>
                  <s>{formatPrice(optionPrevious)}</s>
                </span>
                <span className="now">
                  <span className="price-tag">الآن</span>
                  {formatPrice(optionSelling)}
                </span>
              </button>
            )
          })}
        </div>
        <p className="price" aria-live="polite">
          <span className="price-was">
            <s>{formatPrice(previous)}</s>
            <span className="price-tag">السعر السابق</span>
          </span>
          <span className="price-kicker">سعر البيع لحجم {size} مل</span>
          <span key={`${product.id}-${size}`} className="price-value">
            {formatPrice(selling)}
          </span>
        </p>
        <button
          type="button"
          className={added ? 'add-btn is-added' : 'add-btn'}
          aria-label={
            added
              ? `تمت إضافة ${product.name}`
              : `أضيفي ${product.name} بحجم ${size} مل بسعر ${formatPrice(selling)} إلى السلة`
          }
          onClick={onAdd}
        >
          {added ? 'تمت الإضافة' : 'أضيفي إلى السلة'}
        </button>
      </div>
    </article>
  )
}
