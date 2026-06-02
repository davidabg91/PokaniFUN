import { Link } from 'react-router-dom'
import Hearts from '../components/Hearts.jsx'
import { useLang } from '../i18n.jsx'

export default function NotFound() {
  const { t } = useLang()
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Hearts count={16} />
      <div className="relative z-10">
        <div className="text-7xl">💔</div>
        <h1 className="mt-4 font-display text-3xl font-extrabold">{t('nf_title')}</h1>
        <p className="mt-2 text-white/70">{t('nf_desc')}</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-rose-glow to-fuchsia-500 px-7 py-3 font-extrabold shadow-lg"
        >
          {t('nf_btn')}
        </Link>
      </div>
    </div>
  )
}
