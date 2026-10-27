import { formatPrice, startingPrice } from '../data'

const levels = [
  { id: '40', name: '40 مل' },
  { id: '30', name: '30 مل', current: true },
  { id: '20', name: '20 مل' },
]

export function Hero({ onShop }) {
  return (
    <section className="hero" id="top">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">التعبئة المجزأة</p>
          <h1>اختاري الكمية، لا الزجاجة كاملة</h1>
          <p className="lede">
            عطور ديور وغوتشي وأرماني في ثلاثة أحجام. السعر يتبدل مع الحجم قبل أن يصل العطر إلى السلة.
          </p>
          <button type="button" className="cta" onClick={onShop}>
            تسوّقي الأحجام
          </button>
        </div>
        <div className="hero-visual">
          <figure className="gauge">
            <div className="gauge-neck" aria-hidden="true">
              <span className="cap-stack">
                <span className="gauge-cap" />
                <span className="gauge-collar" />
              </span>
            </div>
            <div className="gauge-main">
              <div className="gauge-glass" aria-hidden="true">
                <span className="tick tick-40" />
                <span className="tick tick-30" />
                <span className="tick tick-20" />
                <span className="gauge-liquid" />
              </div>
              <ul className="gauge-marks">
                {levels.map((level) => (
                  <li key={level.id} className={level.current ? `mark mark-${level.id} is-current` : `mark mark-${level.id}`}>
                    <span>{level.name}</span>
                    <b>من {formatPrice(startingPrice(level.id))}</b>
                  </li>
                ))}
              </ul>
            </div>
            <figcaption>كل خط حجم مستقل بسعره. السائل في الرسم يقف عند 30 مل.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
