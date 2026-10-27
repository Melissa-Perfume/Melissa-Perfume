export const brands = [
  {
    id: 'dior',
    name: 'Dior',
    nameAr: 'ديور',
    keywords: 'ديور dior',
    line: 'جرأة هادئة ولمسة فرنسية.',
    image: '/products/miss-dior.jpg',
  },
  {
    id: 'gucci',
    name: 'Gucci',
    nameAr: 'غوتشي',
    keywords: 'غوتشي قوتشي gucci',
    line: 'زهور دافئة وحضور واضح.',
    image: '/products/bloom.jpg',
  },
  {
    id: 'armani',
    name: 'Armani',
    nameAr: 'أرماني',
    keywords: 'أرماني ارماني armani',
    line: 'أناقة يومية بخطوط نظيفة.',
    image: '/products/acqua.jpg',
  },
]

export const sizeOptions = [
  { id: '20', label: '20 مل' },
  { id: '30', label: '30 مل' },
  { id: '40', label: '40 مل' },
]

export const products = [
  {
    id: 'sauvage',
    brand: 'dior',
    name: 'Sauvage',
    nameAr: 'سوفاج',
    note: 'فلفل وبرغموت وخشب الأرز',
    image: '/products/sauvage.jpg',
    prices: { 20: 180, 30: 250, 40: 310 },
  },
  {
    id: 'miss-dior',
    brand: 'dior',
    name: 'Miss Dior',
    nameAr: 'مس ديور',
    note: 'ورد وفاوانيا ومسك ناعم',
    image: '/products/miss-dior.jpg',
    prices: { 20: 190, 30: 265, 40: 330 },
  },
  {
    id: 'bloom',
    brand: 'gucci',
    name: 'Bloom',
    nameAr: 'بلوم',
    note: 'ياسمين ومسك أبيض',
    image: '/products/bloom.jpg',
    prices: { 20: 170, 30: 240, 40: 300 },
  },
  {
    id: 'guilty',
    brand: 'gucci',
    name: 'Guilty',
    nameAr: 'جيلتي',
    note: 'ليلك وفلفل وردي',
    image: '/products/guilty.jpg',
    prices: { 20: 165, 30: 230, 40: 290 },
  },
  {
    id: 'acqua',
    brand: 'armani',
    name: 'Acqua di Gio',
    nameAr: 'أكوا دي جيو',
    note: 'نسيم بحري وإكليل الجبل',
    image: '/products/acqua.jpg',
    prices: { 20: 160, 30: 220, 40: 280 },
  },
  {
    id: 'si',
    brand: 'armani',
    name: 'Sì',
    nameAr: 'سي',
    note: 'كشمش أسود وفانيلا',
    image: '/products/si.jpg',
    prices: { 20: 185, 30: 255, 40: 320 },
  },
]

export const giftOptions = {
  wrappingFee: 0,
  cardFee: 5,
}

export const deliveryRegions = [
  { id: 'west-bank', name: 'الضفة الغربية', fee: 20 },
  { id: 'jerusalem', name: 'القدس', fee: 30 },
  { id: 'territories-48', name: 'الداخل الفلسطيني (أراضي 48)', fee: 60 },
]

export const deliveryCities = [
  'القدس',
  'رام الله والبيرة',
  'نابلس',
  'الخليل',
  'بيت لحم',
  'أريحا',
  'جنين',
  'طولكرم',
  'قلقيلية',
  'سلفيت',
  'طوباس',
  'غزة',
  'شمال غزة',
  'دير البلح',
  'خان يونس',
  'رفح',
]

export function formatPrice(amount) {
  return `${Math.round(amount)} شيكل`
}

export function originalPrice(selling) {
  return Math.round(Number(selling) * 1.2)
}

export function startingPrice(sizeId) {
  return Math.min(...products.map((product) => product.prices[sizeId]))
}

export function productCountText(count) {
  if (count === 1) return 'منتج واحد'
  if (count === 2) return 'منتجان'
  return `${count} منتجات`
}

export function productImage(product) {
  if (product.image) return product.image
  return brands.find((brand) => brand.id === product.brand)?.image
}

export function matchesQuery(product, query) {
  const brand = brands.find((item) => item.id === product.brand)
  const haystack = [product.name, product.nameAr, product.note, brand?.name, brand?.nameAr, brand?.keywords]
    .join(' ')
    .toLowerCase()
  return haystack.includes(query.trim().toLowerCase())
}
