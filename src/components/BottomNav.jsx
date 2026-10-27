function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 16.5 20 20.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function CatalogsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="4" width="7" height="7" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="4" width="7" height="7" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <rect x="4" y="13" width="7" height="7" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="13" width="7" height="7" rx="1.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.5 8h11l-.8 11.2a1 1 0 0 1-1 .8H8.3a1 1 0 0 1-1-.8z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function NavButton({ label, icon, current, onClick, badge, ariaLabel, expanded }) {
  return (
    <button
      type="button"
      className={current ? 'is-current' : undefined}
      aria-current={current ? 'page' : undefined}
      aria-label={ariaLabel}
      aria-expanded={expanded}
      onClick={onClick}
    >
      {icon}
      <span className="label">{label}</span>
      {badge}
    </button>
  )
}

export function BottomNav({ current, count, cartLabel, onHome, onSearch, onCatalogs, onCart, cartOpen }) {
  const badge =
    count > 0 ? (
      <span className="badge" aria-hidden="true">
        {count > 9 ? '9+' : count}
      </span>
    ) : null

  return (
    <nav className="bottom-nav" aria-label="التنقل السفلي">
      <NavButton label="الرئيسية" icon={<HomeIcon />} current={current === 'home'} onClick={onHome} />
      <NavButton label="البحث" icon={<SearchIcon />} current={current === 'search'} onClick={onSearch} />
      <NavButton label="الكتالوجات" icon={<CatalogsIcon />} current={current === 'catalogs'} onClick={onCatalogs} />
      <NavButton
        label="السلة"
        icon={<BagIcon />}
        current={current === 'cart'}
        onClick={onCart}
        badge={badge}
        ariaLabel={cartLabel}
        expanded={cartOpen}
      />
    </nav>
  )
}
