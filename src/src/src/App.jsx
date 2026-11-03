import { useMemo, useState } from 'react'
import { ShieldCheck, Info, ChevronRight, Star, TrendingDown, Plus, Check, Eye, X, ArrowLeft } from 'lucide-react'

const INSURERS = [
  { id:'vidaplus', name:'VidaPlus', color:'#1e3a5f', baseRate:0.62, qualityScore:82, features:['Asistencia 24/7','Anticipo enfermedad grave','Sin reconocimiento hasta 150.000 €'] },
  { id:'proteccion-familiar', name:'Protección Familiar', color:'#0d9488', baseRate:0.58, qualityScore:88, features:['Fallecimiento reforzado','Doble capital por accidente','100% online'] },
  { id:'segurvida', name:'SegurVida', color:'#7c3aed', baseRate:0.55, qualityScore:79, features:['Prima garantizada','Cobertura internacional','Asistencia en viaje'] },
  { id:'vida-total', name:'Vida Total', color:'#db2777', baseRate:0.68, qualityScore:90, features:['Invalidez profesional','Hospitalización','Revalorización anual'] },
  { id:'horizonte', name:'Horizonte', color:'#ea580c', baseRate:0.6, qualityScore:76, features:['Adaptable','Anticipo enfermedad terminal','App'] },
  { id:'familia-segura', name:'Familia Segura', color:'#16a34a', baseRate:0.57, qualityScore:85, features:['Pensión orfandad','Cobertura cónyuge','Familias'] },
  { id:'vidasmart', name:'VidaSmart', color:'#0891b2', baseRate:0.53, qualityScore:80, features:['100% digital','Precio optimizado','Sin papeleo'] },
  { id:'tranquilidad-life', name:'Tranquilidad Life', color:'#4f46e5', baseRate:0.64, qualityScore:87, features:['Bienestar','Segunda opinión médica','Anticipo capital'] }
]

const PROVINCES = ['Madrid','Barcelona','Valencia','Sevilla','Málaga','Bilbao','Zaragoza','Murcia','Alicante','Palma']

const initialForm = { age:35, province:'Madrid', capital:150000, insuranceType:'riesgo', disability:'si', duration:20, budget:60 }

function calc(ins, form) {
  const age = Number(form.age)||35
  const cap = Number(form.capital)||100000
  const yrs = Number(form.duration)||20
  const hasDis = form.disability==='si'
  const type = form.insuranceType
  const ageF = 1 + Math.pow((age-18)/40, 1.6)
  const capF = 0.4 + cap/250000
  const durF = 0.85 + yrs/60
  const typeF = type==='hipotecario'?0.92:type==='invalidez'?1.18:1
  const disF = hasDis?1.22:1
  return Math.round(ins.baseRate*ageF*capF*durF*typeF*disF*100)/100
}

export default function App() {
  const [form, setForm] = useState(initialForm)
  const [submitted, setSubmitted] = useState(false)
  const [sort, setSort] = useState('price')
  const [sel, setSel] = useState([])
  const [detail, setDetail] = useState(null)

  const offers = useMemo(() => {
    const list = INSURERS.map(i => {
      const monthly = calc(i, form)
      return { ...i, monthly, annual: Math.round(monthly*12*100)/100, capital:Number(form.capital), duration:Number(form.duration) }
    }).sort((a,b)=>a.monthly-b.monthly)
    const bestP = list[0]?.id
    const bestC = [...list].sort((a,b)=>b.qualityScore-a.qualityScore)[0]?.id
    let out = list.map(o=>({...o, isBestPrice:o.id===bestP, isBestCoverage:o.id===bestC}))
    if (sort==='coverage') out.sort((a,b)=>b.qualityScore-a.qualityScore)
    if (sort==='value') out.sort((a,b)=>b.qualityScore/a.monthly - a.qualityScore/a.monthly)
    return out
  }, [form, sort])

  const upd = (k,v) => setForm(f=>({...f,[k]:v}))
  const toggleSel = (o) => setSel(s => s.find(x=>x.id===o.id) ? s.filter(x=>x.id!==o.id) : s.length>=3?s:[...s,o])

  if (!submitted) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white"><ShieldCheck size={20}/></span>
            <div>
              <h1 className="font-bold text-brand-700 text-xl">VidaCompare</h1>
              <p className="text-xs text-slate-500">Comparador de seguros de vida</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6">
            <h2 className="text-2xl font-extrabold text-brand-700">Protege a los tuyos.</h2>
            <p className="text-teal-600 font-bold text-lg mb-6">Encuentra tu seguro de vida ideal.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="text-sm">Edad
                <input type="number" value={form.age} onChange={e=>upd('age',e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300"/>
              </label>
              <label className="text-sm">Provincia
                <select value={form.province} onChange={e=>upd('province',e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300">
                  {PROVINCES.map(p=><option key={p}>{p}</option>)}
                </select>
              </label>
              <label className="text-sm sm:col-span-2">Capital: <b className="text-teal-600">{Number(form.capital).toLocaleString('es-ES')} €</b>
                <input type="range" min={30000} max={500000} step={10000} value={form.capital} onChange={e=>upd('capital',e.target.value)} className="w-full mt-1"/>
              </label>
              <label className="text-sm">Tipo
                <select value={form.insuranceType} onChange={e=>upd('insuranceType',e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300">
                  <option value="riesgo">Vida riesgo</option>
                  <option value="hipotecario">Vida hipotecario</option>
                  <option value="invalidez">Vida con invalidez</option>
                </select>
              </label>
              <label className="text-sm">Invalidez
                <select value={form.disability} onChange={e=>upd('disability',e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300">
                  <option value="si">Sí</option><option value="no">No</option>
                </select>
              </label>
              <label className="text-sm">Duración
                <select value={form.duration} onChange={e=>upd('duration',e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-300">
                  {[10,15,20,25,30].map(y=><option key={y} value={y}>{y} años</option>)}
                </select>
              </label>
              <label className="text-sm">Presupuesto: <b className="text-teal-600">{form.budget} €/mes</b>
                <input type="range" min={5} max={300} step={5} value={form.budget} onChange={e=>upd('budget',e.target.value)} className="w-full mt-1"/>
              </label>
            </div>
            <button onClick={()=>setSubmitted(true)} className="mt-6 w-full py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition inline-flex items-center justify-center gap-2">
              Comparar seguros <ChevronRight size={18}/>
            </button>
            <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-3">
              <Info size={14} className="text-teal-600 mt-0.5 shrink-0"/>
              <p>Precios simulados con fines demostrativos. No constituyen una oferta comercial.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white"><ShieldCheck size={16}/></span>
            <span className="font-bold text-brand-700">VidaCompare</span>
          </div>
          <button onClick={()=>setSubmitted(false)} className="text-sm text-brand-700 font-semibold hover:underline inline-flex items-center gap-1"><ArrowLeft size={14}/> Modificar datos</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-extrabold text-brand-700 mb-1">Resultados</h1>
        <p className="text-sm text-slate-500 mb-4">{form.age} años · {Number(form.capital).toLocaleString('es-ES')} € · {form.duration} años · {form.insuranceType}</p>

        <div className="bg-white rounded-xl border border-slate-100 shadow-soft p-3 mb-4 flex flex-wrap gap-2 items-center">
          <select value={sort} onChange={e=>setSort(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 text-sm">
            <option value="price">Ordenar por precio</option>
            <option value="coverage">Ordenar por cobertura</option>
            <option value="value">Ordenar por calidad-precio</option>
          </select>
          <div className="text-xs text-slate-500">Seleccionados: {sel.length}/3</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {offers.map(o=>(
            <article key={o.id} className="bg-white rounded-2xl border border-slate-100 shadow-soft p-5 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{backgroundColor:o.color}}>{o.name.charAt(0)}</span>
                  <div>
                    <h3 className="font-bold text-brand-700 leading-tight">{o.name}</h3>
                    <p className="text-xs text-slate-500">Seguro de vida</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  {o.isBestPrice && <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full inline-flex items-center gap-1"><TrendingDown size={11}/>Mejor precio</span>}
                  {o.isBestCoverage && <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-full inline-flex items-center gap-1"><Star size={11}/>Mejor cobertura</span>}
                </div>
              </div>
              <div className="mt-4 flex items-end gap-1">
                <span className="text-3xl font-extrabold text-brand-700">{o.monthly.toFixed(2)} €</span>
                <span className="text-sm text-slate-500 mb-1">/mes</span>
              </div>
              <p className="text-xs text-slate-500">{o.annual.toFixed(2)} € / año</p>
              <ul className="mt-3 space-y-1 text-xs text-slate-600">
                {o.features.map(f=><li key={f} className="flex gap-1.5"><Check size={12} className="text-teal-500 mt-0.5 shrink-0"/>{f}</li>)}
              </ul>
              <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2 mt-auto">
                <button onClick={()=>setDetail(o)} className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-brand-700 text-sm font-medium hover:bg-slate-50 inline-flex items-center justify-center gap-1"><Eye size={14}/>Ver</button>
                <button onClick={()=>toggleSel(o)} className={`px-3 py-2 rounded-lg text-sm font-semibold border ${sel.find(s=>s.id===o.id)?'bg-brand-500 text-white border-brand-500':'border-slate-300 text-brand-700'}`}>{sel.find(s=>s.id===o.id)?<Check size={14}/>:<Plus size={14}/>}</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {sel.length>0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-slate-600">{sel.length} seleccionado(s): {sel.map(s=>s.name).join(', ')}</div>
          <button onClick={()=>setSel([])} className="text-sm text-slate-500 hover:text-red-500">Limpiar</button>
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setDetail(null)}/>
          <div className="relative bg-white rounded-2xl shadow-card max-w-md w-full p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-brand-700">{detail.name}</h3>
              <button onClick={()=>setDetail(null)} className="p-1 rounded hover:bg-slate-100"><X size={18}/></button>
            </div>
            <p className="text-3xl font-extrabold text-brand-700">{detail.monthly.toFixed(2)} € <span className="text-sm font-normal text-slate-500">/mes</span></p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
              {detail.features.map(f=><li key={f} className="flex gap-2"><Check size={14} className="text-teal-500 mt-0.5"/>{f}</li>)}
            </ul>
            <div className="mt-3 text-xs text-slate-500 bg-slate-50 rounded-lg p-2">Precio simulado. No es una oferta real.</div>
            <button onClick={()=>{alert('Demo: aquí se redirigiría a la aseguradora'); setDetail(null)}} className="mt-4 w-full py-2.5 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600">Seleccionar seguro</button>
          </div>
        </div>
      )}
    </div>
  )
}
