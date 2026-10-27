import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { brands, matchesQuery, productImage, products } from './data'
import { BrandCollections } from './components/BrandCollections'
import { BottomNav } from './components/BottomNav'
import { CartDrawer } from './components/CartDrawer'
import { Hero } from './components/Hero'
import { ProductCard } from './components/ProductCard'

const initialSizes = Object.fromEntries(products.map((product) => [product.id, '30']))

function perfumeCount(count) {
  if (count === 0) return 'لا توجد عطور مطابقة. جرّبي اسماً آخر أو اعرضي كل الماركات.'
  if (count === 1) return 'عطر واحد'
  if (count === 2) return 'عطران'
  return `${count} عطور`
}

function cartLabel(count) {
  if (count === 0) return 'السلة'
  if (count === 1) return 'السلة، عنصر واحد'
  if (count === 2) return 'السلة، عنصران'
  return `السلة، ${count} عناصر`
}

export default function App() {
  const [brandId, setBrandId] = useState('all')
  const [query, setQuery] = useState('')
  const [sizes, setSizes] = useState(initialSizes)
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [justAdded, setJustAdded] = useState(null)
  const [notice, setNotice] = useState('')
  const [orderNote, setOrderNote] = useState('')
  const searchRef = useRef(null)
  const addedTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(addedTimer.current), [])

  const closeCart = useCallback(() => setCartOpen(false), [])

  const brandCards = useMemo(
    () =>
      brands.map((brand) => ({
        ...brand,
        count: products.filter((product) => product.brand === brand.id).length,
      })),
    [],
  )

  const filtered = products.filter((product) => {
    if (brandId !== 'all' && product.brand !== brandId) return false
    if (!query.trim()) return true
    return matchesQuery(product, query)
  })

  const lines = cart.map((item) => {
    const product = products.find((entry) => entry.id === item.productId)
    const brand = brands.find((entry) => entry.id === product.brand)
    const price = product.prices[item.sizeId]
    return {
      ...item,
      name: product.name,
      brandName: brand.name,
      brandId: product.brand,
      image: productImage(product),
      price,
      sizeLabel: `${item.sizeId} مل`,
      lineTotal: price * item.qty,
    }
  })

  const count = lines.reduce((sum, line) => sum + line.qty, 0)
  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0)
  const activeBrand = brands.find((brand) => brand.id === brandId)
  const current = cartOpen ? 'cart' : active
  const basketLabel = cartLabel(count)

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function goHome() {
    setActive('home')
    setCartOpen(false)
    scrollTo('top')
  }

  function goSearch() {
    setActive('search')
    setCartOpen(false)
    scrollTo('products')
    window.setTimeout(() => searchRef.current?.focus(), 320)
  }

  function goCatalogs() {
    setActive('catalogs')
    setCartOpen(false)
    scrollTo('catalogs')
  }

  function selectBrand(id) {
    setBrandId((currentId) => (currentId === id ? 'all' : id))
    scrollTo('products')
  }

  function addProduct(product) {
    const sizeId = sizes[product.id]
    setCart((items) => {
      const exists = items.some((item) => item.productId === product.id && item.sizeId === sizeId)
      if (!exists) return [...items, { productId: product.id, sizeId, qty: 1 }]
      return items.map((item) =>
        item.productId === product.id && item.sizeId === sizeId ? { ...item, qty: item.qty + 1 } : item,
      )
    })
    setNotice(`أُضيف ${product.name} بحجم ${sizeId} مل إلى السلة`)
    setOrderNote('')
    setJustAdded(product.id)
    window.clearTimeout(addedTimer.current)
    addedTimer.current = window.setTimeout(() => setJustAdded(null), 1400)
  }

  function setQuantity(line, qty) {
    setCart((items) =>
      items.map((item) =>
        item.productId === line.productId && item.sizeId === line.sizeId ? { ...item, qty } : item,
      ),
    )
    setOrderNote('')
  }

  function removeLine(line) {
    setCart((items) => items.filter((item) => !(item.productId === line.productId && item.sizeId === line.sizeId)))
    setOrderNote('')
    setNotice(`حُذف ${line.name} بحجم ${line.sizeLabel} من السلة`)
  }

  function checkout() {
    if (lines.length === 0 || orderNote) return
    const message = 'لم يُنشأ الطلب. المتجر لا يحفظ الطلبات ولا يؤكدها.'
    setOrderNote(message)
    setNotice(message)
  }

  return (
    <>
      <div className="page">
        <header className="site-header">
          <div className="wrap header-bar">
            <a
              className="logo"
              href="#top"
              onClick={(event) => {
                event.preventDefault()
                goHome()
              }}
            >
              <strong>قِسمة</strong>
              <small>تعبئة مجزأة</small>
            </a>
            <nav className="desktop-nav" aria-label="التنقل الرئيسي">
              <button type="button" className={current === 'home' ? 'is-current' : undefined} onClick={goHome}>
                الرئيسية
              </button>
              <button type="button" className={current === 'search' ? 'is-current' : undefined} onClick={goSearch}>
                البحث
              </button>
              <button type="button" className={current === 'catalogs' ? 'is-current' : undefined} onClick={goCatalogs}>
                الكتالوجات
              </button>
              <button
                type="button"
                className={current === 'cart' ? 'is-current' : undefined}
                aria-label={basketLabel}
                aria-expanded={cartOpen}
                onClick={() => setCartOpen(true)}
              >
                السلة
                {count > 0 && <span className="nav-count">{count > 9 ? '9+' : count}</span>}
              </button>
            </nav>
          </div>
        </header>

        <main>
          {cartOpen ? (
            <div className="wrap">
              <CartDrawer
                lines={lines}
                total={total}
                orderNote={orderNote}
                onClose={closeCart}
                onRemove={removeLine}
                onQuantity={setQuantity}
                onCheckout={checkout}
              />
            </div>
          ) : (
          <div className="wrap">
            <Hero onShop={() => scrollTo('products')} />
            <BrandCollections brands={brandCards} selectedId={brandId} onSelect={selectBrand} />
            <section className="section" id="products" aria-labelledby="products-title">
              <div className="section-head">
                <div>
                  <p className="eyebrow">اختاري الحجم</p>
                  <h2 id="products-title">{activeBrand ? activeBrand.name : 'كل العطور'}</h2>
                  <p className="result-count" role="status">
                    {perfumeCount(filtered.length)}
                  </p>
                </div>
                <label className="search">
                  <span className="sr-only">ابحثي عن عطر</span>
                  <input
                    id="search"
                    ref={searchRef}
                    type="search"
                    placeholder="ابحثي عن عطر أو ماركة"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
              </div>
              {activeBrand && (
                <div className="filter-row">
                  <p>تعرضين كتالوج {activeBrand.name}</p>
                  <button type="button" className="text-btn" onClick={() => setBrandId('all')}>
                    عرض الكل
                  </button>
                </div>
              )}
              {filtered.length > 0 && (
                <div className="product-grid">
                  {filtered.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      size={sizes[product.id]}
                      added={justAdded === product.id}
                      onSize={(sizeId) => setSizes((currentSizes) => ({ ...currentSizes, [product.id]: sizeId }))}
                      onAdd={() => addProduct(product)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
          )}
        </main>

        <footer className="site-footer">
          <div className="wrap">
            <p>قِسمة — عطور مختارة بالتعبئة المجزأة، في أحجام 20 و30 و40 مل.</p>
          </div>
        </footer>

        <BottomNav
          current={current}
          count={count}
          cartLabel={basketLabel}
          cartOpen={cartOpen}
          onHome={goHome}
          onSearch={goSearch}
          onCatalogs={goCatalogs}
          onCart={() => setCartOpen(true)}
        />
      </div>
      <p className="sr-only" aria-live="polite">
        {notice}
      </p>
    </>
  )
}
