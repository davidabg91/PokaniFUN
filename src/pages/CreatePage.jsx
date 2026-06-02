import { useState } from 'react'
import { motion } from 'framer-motion'
import Hearts from '../components/Hearts.jsx'
import { HopefulChar } from '../components/Characters.jsx'
import { PhotoPicker, VoiceRecorder } from '../components/MediaInputs.jsx'
import { createInvitation } from '../api.js'
import { bgEmojis } from '../lib.js'
import { useLang } from '../i18n.jsx'

const genders = [
  { key: 'female', emoji: '👩' },
  { key: 'male', emoji: '👨' },
  { key: 'other', emoji: '🦄' },
]

export default function CreatePage() {
  const { t } = useLang()
  const [form, setForm] = useState({
    senderName: '',
    recipientName: '',
    recipientGender: 'female',
    kind: 'romantic',
    message: '',
  })
  const [photo, setPhoto] = useState(null)
  const [audio, setAudio] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null) // { id }
  const [copied, setCopied] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.senderName.trim()) return setError(t('err_name'))
    setLoading(true)
    try {
      const { id } = await createInvitation({ ...form, photo, audio })
      setCreated({ id })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const origin = window.location.origin
  const inviteUrl = created ? `${origin}/i/${created.id}` : ''
  const resultUrl = created ? `${origin}/r/${created.id}` : ''

  const copy = async (text, which) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(which)
      setTimeout(() => setCopied(''), 1800)
    } catch {
      setCopied('')
    }
  }

  const share = async () => {
    const text = t(form.kind === 'romantic' ? 'share_text_romantic' : 'share_text_friendly')
    if (navigator.share) {
      try {
        await navigator.share({ title: t('create_title'), text, url: inviteUrl })
      } catch {
        /* user cancelled */
      }
    } else {
      copy(inviteUrl, 'invite')
    }
  }

  return (
    <div className="relative min-h-screen px-5 py-6">
      <Hearts count={20} emojis={bgEmojis(form.kind, form.recipientGender)} />

      <div className="relative z-10 mx-auto w-full max-w-xl">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 text-center"
        >
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
            <span className="text-gradient">{t('create_title')}</span>
          </h1>
          <p className="mt-1 text-sm text-white/70">{t('create_subtitle')}</p>
        </motion.header>

        {!created ? (
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-5 sm:p-6"
          >
            <Field label={t('field_your_name')}>
              <input
                value={form.senderName}
                onChange={set('senderName')}
                placeholder={t('ph_your_name')}
                className="input"
                maxLength={60}
              />
            </Field>

            <Field label={t('field_recipient_name')}>
              <input
                value={form.recipientName}
                onChange={set('recipientName')}
                placeholder={t('ph_recipient_name')}
                className="input"
                maxLength={60}
              />
            </Field>

            <Field label={t('field_kind')}>
              <div className="grid grid-cols-2 gap-3">
                <Choice
                  active={form.kind === 'romantic'}
                  onClick={() => setForm((f) => ({ ...f, kind: 'romantic' }))}
                >
                  {t('kind_romantic')}
                </Choice>
                <Choice
                  active={form.kind === 'friendly'}
                  onClick={() => setForm((f) => ({ ...f, kind: 'friendly' }))}
                >
                  {t('kind_friendly')}
                </Choice>
              </div>
            </Field>

            <Field label={t('field_recipient')}>
              <div className="grid grid-cols-3 gap-3">
                {genders.map((g) => (
                  <Choice
                    key={g.key}
                    active={form.recipientGender === g.key}
                    onClick={() => setForm((f) => ({ ...f, recipientGender: g.key }))}
                  >
                    {g.emoji} {t('gender_' + g.key)}
                  </Choice>
                ))}
              </div>
            </Field>

            <Field label={t('field_message')}>
              <textarea
                value={form.message}
                onChange={set('message')}
                placeholder={t('ph_message')}
                rows={2}
                className="input resize-none"
                maxLength={400}
              />
            </Field>

            <Field label={t('field_photo')}>
              <PhotoPicker photo={photo} onChange={setPhoto} />
            </Field>

            <Field label={t('field_voice')}>
              <VoiceRecorder audio={audio} onChange={setAudio} />
            </Field>

            {error && <p className="mb-3 text-center font-bold text-rose-300">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-2xl bg-gradient-to-r from-rose-glow to-fuchsia-500 px-6 py-3.5 text-lg font-extrabold shadow-[0_12px_30px_-8px_rgba(255,45,111,.7)] transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
            >
              {loading ? t('btn_creating') : t('btn_create')}
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-6 text-center sm:p-8"
          >
            <div className="mx-auto -mt-2 mb-2 flex justify-center">
              <HopefulChar size={150} />
            </div>
            <h2 className="font-display text-2xl font-extrabold">{t('created_title')}</h2>
            <p className="mt-1 text-white/70">{t('created_share_line')}</p>

            <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/15 bg-black/25 p-2">
              <input readOnly value={inviteUrl} className="w-full bg-transparent px-2 text-sm text-white/90 outline-none" />
              <button
                onClick={() => copy(inviteUrl, 'invite')}
                className="shrink-0 rounded-xl bg-white/15 px-4 py-2 font-bold hover:bg-white/25"
              >
                {copied === 'invite' ? '✓' : t('btn_copy')}
              </button>
            </div>

            <div className="mt-3 flex gap-2">
              <a
                href={inviteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 font-bold hover:bg-white/20"
              >
                {t('btn_preview')}
              </a>
              <button
                onClick={share}
                className="flex-1 rounded-2xl bg-gradient-to-r from-rose-glow to-fuchsia-500 px-4 py-3 font-extrabold"
              >
                {t('btn_share')}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-300/30 bg-amber-300/10 p-4 text-left">
              <p className="text-sm font-bold text-amber-200">{t('result_link_title')}</p>
              <p className="mt-1 text-xs text-white/60">{t('result_link_desc')}</p>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/15 bg-black/25 p-2">
                <input readOnly value={resultUrl} className="w-full bg-transparent px-2 text-sm text-white/90 outline-none" />
                <button
                  onClick={() => copy(resultUrl, 'result')}
                  className="shrink-0 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-bold hover:bg-white/25"
                >
                  {copied === 'result' ? '✓' : t('btn_copy')}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setCreated(null)
                setPhoto(null)
                setAudio(null)
                setForm((f) => ({ ...f, message: '', recipientName: '' }))
              }}
              className="mt-5 text-sm font-bold text-white/60 underline underline-offset-4 hover:text-white"
            >
              {t('btn_create_another')}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="mb-2.5 block">
      <span className="mb-1 block text-sm font-bold text-white/80">{label}</span>
      {children}
    </label>
  )
}

function Choice({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border px-3 py-2.5 text-sm font-extrabold transition-all ${
        active
          ? 'border-rose-glow bg-rose-glow/20 text-white shadow-[0_0_0_2px_rgba(255,91,138,.5)]'
          : 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  )
}
