import { useEffect, useRef, useState } from 'react'
import { deliveryCities, deliveryRegions, giftOptions } from '../data'
import { ProductImage } from './ProductImage'

function lineKey(line) {
  return `${line.productId}-${line.sizeId}`
}

function isPalestinianPhone(value) {
  const compact = value.replace(/[\s()-]/g, '')
  return /^(?:\+970|\+972|00970|00972|0)5\d{8}$/.test(compact)
}

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  region: '',
  city: '',
  address: '',
  notes: '',
  isGift: false,
  giftCard: false,
  giftScent: '',
  giftMessage: '',
}

function shekel(amount) {
  return `${Math.round(amount)} ₪`
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3.5 19 6.2v5.4c0 4.2-2.8 7.2-7 8.9-4.2-1.7-7-4.7-7-8.9V6.2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 12.1 11 14.1 15.2 9.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8.2V12l2.6 1.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export function CartDrawer({ lines, total, orderNote, onClose, onRemove, onQuantity, onCheckout }) {
  const headingRef = useRef(null)
  const placingRef = useRef(false)
  const [pendingKey, setPendingKey] = useState(null)
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const subtotal = total
  const hasItems = lines.length > 0
  const region = deliveryRegions.find((item) => item.id === form.region)
  const deliveryFee = region ? region.fee : null
  const scentChoices = lines.filter((line, index, all) => all.findIndex((item) => item.productId === line.productId) === index)
  const cardFee = form.isGift && form.giftCard ? giftOptions.cardFee : 0
  const payable = (deliveryFee == null ? subtotal : subtotal + deliveryFee) + cardFee

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  useEffect(() => {
    placingRef.current = false
    setPlacing(false)
  }, [lines, total])

  useEffect(() => {
    if (!form.giftScent) return
    if (scentChoices.some((line) => line.productId === form.giftScent)) return
    setForm((current) => ({ ...current, giftScent: '' }))
  }, [form.giftScent, scentChoices])

  function askRemove(line) {
    setPendingKey(lineKey(line))
  }

  function changeQty(line, delta) {
    const next = line.qty + delta
    if (next < 1) {
      askRemove(line)
      return
    }
    setPendingKey(null)
    onQuantity(line, next)
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = 'هذا الحقل مطلوب'
    if (!form.phone.trim()) next.phone = 'هذا الحقل مطلوب'
    else if (!isPalestinianPhone(form.phone)) next.phone = 'أدخلي رقماً فلسطينياً يبدأ بـ 05، مثل 0591234567'
    if (!form.region) next.region = 'اختاري منطقة التوصيل'
    if (!form.city.trim()) next.city = 'اختاري المدينة'
    if (!form.address.trim()) next.address = 'هذا الحقل مطلوب'
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = 'صيغة البريد غير صحيحة'
    }
    if (form.isGift && form.giftCard && !form.giftScent) next.giftScent = 'اختاري رائحة البطاقة من عطور الطلب'
    return next
  }

  function placeOrder() {
    if (!hasItems || placingRef.current || orderNote) return
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length > 0) {
      const first = document.getElementById(Object.keys(next)[0])
      first?.focus()
      return
    }
    placingRef.current = true
    setPlacing(true)
    onCheckout()
  }

  return (
    <section className="cart-page" aria-labelledby="cart-title">
      <header className="cart-page-head">
        <p className="eyebrow">سيلاج</p>
        <h2 id="cart-title" ref={headingRef} tabIndex={-1}>
          السلة
        </h2>
        <button type="button" className="text-btn" onClick={onClose}>
          العودة للتسوق
        </button>
      </header>

      <div className="cart-layout">
        <div className="cart-main-col">
          {hasItems ? (
            <ul className="cart-list">
              {lines.map((line) => {
                const pending = pendingKey === lineKey(line)
                return (
                  <li key={lineKey(line)} className="cart-line">
                    <ProductImage className="cart-thumb" src={line.image} alt="" width="84" height="108" />
                    <div className="cart-copy">
                      <strong className="cart-name">{line.name}</strong>
                      <p className="cart-brand">{line.brandName}</p>
                      <p className="cart-size">الحجم {line.sizeLabel}</p>
                      <p className="cart-unit">سعر الوحدة {shekel(line.price)}</p>
                      {pending ? (
                        <div className="confirm-warn" role="alert">
                          <p>
                            حذف {line.name} بحجم {line.sizeLabel} من السلة؟
                          </p>
                          <div className="confirm-actions">
                            <button type="button" className="text-btn" onClick={() => setPendingKey(null)}>
                              إبقاء
                            </button>
                            <button type="button" className="text-btn confirm-delete" onClick={() => onRemove(line)}>
                              حذف
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="cart-actions">
                          <div className="qty" role="group" aria-label={`كمية ${line.name}`}>
                            <button type="button" className="qty-btn" aria-label="إنقاص الكمية" onClick={() => changeQty(line, -1)}>
                              −
                            </button>
                            <span className="qty-value">{line.qty}</span>
                            <button type="button" className="qty-btn" aria-label="زيادة الكمية" onClick={() => changeQty(line, 1)}>
                              +
                            </button>
                          </div>
                          <button type="button" className="text-btn" onClick={() => askRemove(line)}>
                            حذف
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="cart-line-total">{shekel(line.lineTotal)}</p>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="cart-empty">سلتك فارغة. اختاري الحجم ثم أضيفي العطر.</p>
          )}

          <form className="checkout-form" onSubmit={(event) => event.preventDefault()} noValidate>
            <section className="checkout-block" aria-labelledby="customer-title">
              <h3 id="customer-title">معلومات العميل</h3>
              <label htmlFor="name">
                الاسم الكامل <span className="req" aria-hidden="true">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="الاسم كما سيظهر لمندوب التوصيل"
                value={form.name}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? 'name-error' : undefined}
                onChange={(event) => updateField('name', event.target.value)}
              />
              {errors.name && <p id="name-error" className="field-error">{errors.name}</p>}

              <label htmlFor="phone">
                رقم الهاتف <span className="req" aria-hidden="true">*</span>
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                required
                placeholder="0591234567"
                value={form.phone}
                aria-invalid={errors.phone ? true : undefined}
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                onChange={(event) => updateField('phone', event.target.value)}
              />
              {errors.phone && <p id="phone-error" className="field-error">{errors.phone}</p>}

              <label htmlFor="email">
                البريد الإلكتروني <span className="optional">اختياري</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={form.email}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? 'email-error' : undefined}
                onChange={(event) => updateField('email', event.target.value)}
              />
              {errors.email && <p id="email-error" className="field-error">{errors.email}</p>}
            </section>

            <section className="checkout-block" aria-labelledby="address-title">
              <h3 id="address-title">عنوان التوصيل</h3>
              <label htmlFor="region">
                منطقة التوصيل <span className="req" aria-hidden="true">*</span>
              </label>
              <select
                id="region"
                name="region"
                required
                value={form.region}
                aria-invalid={errors.region ? true : undefined}
                aria-describedby={errors.region ? 'region-error' : undefined}
                onChange={(event) => updateField('region', event.target.value)}
              >
                <option value="">اختاري منطقة التوصيل</option>
                {deliveryRegions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {errors.region && <p id="region-error" className="field-error">{errors.region}</p>}

              <label htmlFor="city">
                المدينة / المنطقة <span className="req" aria-hidden="true">*</span>
              </label>
              <select
                id="city"
                name="city"
                required
                value={form.city}
                aria-invalid={errors.city ? true : undefined}
                aria-describedby={errors.city ? 'city-error' : undefined}
                onChange={(event) => updateField('city', event.target.value)}
              >
                <option value="">اختاري المدينة</option>
                {deliveryCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && <p id="city-error" className="field-error">{errors.city}</p>}

              <label htmlFor="address">
                العنوان التفصيلي <span className="req" aria-hidden="true">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                required
                rows={3}
                placeholder="الحي، الشارع، وأقرب معلم"
                value={form.address}
                aria-invalid={errors.address ? true : undefined}
                aria-describedby={errors.address ? 'address-error' : undefined}
                onChange={(event) => updateField('address', event.target.value)}
              />
              {errors.address && <p id="address-error" className="field-error">{errors.address}</p>}

              <label htmlFor="notes">
                ملاحظات للتوصيل <span className="optional">اختياري</span>
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                placeholder="تعليمات إضافية للمندوب"
                value={form.notes}
                onChange={(event) => updateField('notes', event.target.value)}
              />
            </section>

            <section className="checkout-block" aria-labelledby="gift-title">
              <h3 id="gift-title">التغليف والإهداء</h3>
              <label className="cod-option">
                <input
                  id="isGift"
                  type="checkbox"
                  checked={form.isGift}
                  onChange={(event) => {
                    const checked = event.target.checked
                    setForm((current) => ({
                      ...current,
                      isGift: checked,
                      giftCard: checked ? current.giftCard : false,
                    }))
                  }}
                />
                <span>هل هذا الطلب هدية</span>
              </label>
              {form.isGift && (
                <div className="gift-panel">
                  <p>تغليف العطور مجاني.</p>
                  <label className="cod-option">
                    <input
                      id="giftCard"
                      type="checkbox"
                      checked={form.giftCard}
                      onChange={(event) => {
                        const checked = event.target.checked
                        setForm((current) => ({
                          ...current,
                          giftCard: checked,
                          giftScent: checked && scentChoices.length === 1 ? scentChoices[0].productId : current.giftScent,
                        }))
                      }}
                    />
                    <span>بطاقة الإهداء الفخمة — {shekel(giftOptions.cardFee)}</span>
                  </label>
                  {form.giftCard && (
                    <>
                      <label htmlFor="giftScent">
                        رائحة البطاقة <span className="req" aria-hidden="true">*</span>
                      </label>
                      <select
                        id="giftScent"
                        value={form.giftScent}
                        aria-invalid={errors.giftScent ? true : undefined}
                        aria-describedby={errors.giftScent ? 'gift-scent-error' : 'gift-scent-help'}
                        onChange={(event) => updateField('giftScent', event.target.value)}
                      >
                        <option value="">اختاري عطراً من الطلب</option>
                        {scentChoices.map((line) => (
                          <option key={line.productId} value={line.productId}>
                            {line.brandName} — {line.name}
                          </option>
                        ))}
                      </select>
                      <p id="gift-scent-help" className="field-help">تُعطَّر البطاقة برائحة عطر من طلبك.</p>
                      {errors.giftScent && <p id="gift-scent-error" className="field-error">{errors.giftScent}</p>}
                    </>
                  )}
                  <label htmlFor="giftMessage">
                    رسالة الإهداء <span className="optional">اختياري</span>
                  </label>
                  <textarea
                    id="giftMessage"
                    rows={3}
                    placeholder="اكتبي كلماتك على البطاقة"
                    value={form.giftMessage}
                    onChange={(event) => updateField('giftMessage', event.target.value)}
                  />
                </div>
              )}
            </section>

            <section className="checkout-block" aria-labelledby="pay-title">
              <h3 id="pay-title">طريقة الدفع</h3>
              <fieldset className="pay-card">
                <legend className="sr-only">طريقة الدفع</legend>
                <label className="cod-option">
                  <input type="radio" name="payment" value="cod" defaultChecked />
                  <span>الدفع عند الاستلام</span>
                </label>
              </fieldset>
              <ul className="trust-list">
                <li>
                  <ShieldIcon />
                  <span>يمكن التحقق من الطلبية قبل الاستلام</span>
                </li>
                <li>
                  <ClockIcon />
                  <span>يمكن إلغاء الطلبية مجانًا في حال تأخر التوصيل عن 3 أيام</span>
                </li>
              </ul>
            </section>
          </form>

          <section className="register-card" aria-labelledby="register-title">
            <h3 id="register-title">سجّل الآن واستمتع بمزايا حصرية</h3>
            <p>احفظ عطورك المفضلة، وتابع طلباتك بسهولة، وارجع إلى اختياراتك في أي وقت.</p>
            <ul className="benefit-list">
              <li>حفظ قائمة العطور المفضلة.</li>
              <li>متابعة الطلبات بسهولة.</li>
              <li>الوصول إلى الاختيارات المحفوظة عند العودة.</li>
            </ul>
            <div className="register-actions">
              <button type="button" className="register-primary" disabled>
                إنشاء حساب جديد
              </button>
              <button type="button" className="register-guest" onClick={placeOrder} disabled={!hasItems || placing || Boolean(orderNote)}>
                متابعة التسوق كضيف
              </button>
            </div>
            <p className="register-note">إنشاء الحساب غير متوفر في هذا المتجر. يمكنك إتمام الطلب كضيفة دون حساب.</p>
          </section>
        </div>

        <aside className="cart-summary" aria-labelledby="summary-title">
          <h3 id="summary-title">ملخص الطلب</h3>
          {hasItems && (
            <ul className="summary-items">
              {lines.map((line) => (
                <li key={lineKey(line)}>
                  <ProductImage src={line.image} alt="" width="48" height="64" />
                  <div>
                    <strong>{line.name}</strong>
                    <p>{line.sizeLabel}</p>
                    <p>
                      {line.qty} × {shekel(line.price)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <dl className="summary-rows">
            <div>
              <dt>المجموع الفرعي</dt>
              <dd>{shekel(subtotal)}</dd>
            </div>
            {form.isGift && (
              <div>
                <dt>التغليف</dt>
                <dd>مجاني</dd>
              </div>
            )}
            {cardFee > 0 && (
              <div>
                <dt>بطاقة الإهداء</dt>
                <dd aria-live="polite">{shekel(cardFee)}</dd>
              </div>
            )}
            <div>
              <dt>رسوم التوصيل</dt>
              <dd aria-live="polite">{deliveryFee == null ? '—' : shekel(deliveryFee)}</dd>
            </div>
            <div className="summary-total">
              <dt>المجموع النهائي</dt>
              <dd aria-live="polite">{shekel(payable)}</dd>
            </div>
          </dl>
          <p className="delivery-note">
            {deliveryFee == null
              ? 'اختاري منطقة التوصيل ليظهر رسم التوصيل ضمن المجموع.'
              : `توصيل ${region.name}: ${shekel(deliveryFee)}. هذه أسعار افتراضية للمتجر، وليست تعرفة شركة توصيل.`}
          </p>

          {orderNote && (
            <p className="order-note" role="status">
              {orderNote}
            </p>
          )}

          <button type="button" className="checkout-btn" onClick={placeOrder} disabled={!hasItems || placing || Boolean(orderNote)}>
            {placing ? 'جارٍ الإرسال' : 'إتمام الطلب'}
          </button>
        </aside>
      </div>
    </section>
  )
}
