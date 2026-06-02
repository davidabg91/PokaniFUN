import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n.jsx'

/* ---------- Photo picker with preview ---------- */
export function PhotoPicker({ photo, onChange }) {
  const { t } = useLang()
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (!photo) return setPreview(null)
    const url = URL.createObjectURL(photo)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [photo])

  return (
    <div className="flex items-center gap-3">
      {preview ? (
        <img
          src={preview}
          alt="преглед"
          className="h-16 w-16 shrink-0 rounded-2xl border border-white/20 object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-dashed border-white/25 bg-white/5 text-2xl">
          🖼️
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-xl bg-white/15 px-4 py-2 text-sm font-bold hover:bg-white/25"
        >
          {photo ? t('photo_change') : t('photo_add')}
        </button>
        {photo && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm font-bold text-white/60 hover:text-white"
          >
            {t('remove')}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onChange(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}

/* ---------- Voice recorder (record from mic, or upload a file) ---------- */
export function VoiceRecorder({ audio, onChange }) {
  const { t } = useLang()
  const [recording, setRecording] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)
  const recRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const fileRef = useRef(null)

  const canRecord =
    typeof window !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof MediaRecorder !== 'undefined'

  useEffect(() => {
    if (!audio) return setPreviewUrl(null)
    const url = URL.createObjectURL(audio)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [audio])

  // Tidy up the mic stream + timer if unmounted mid-recording.
  useEffect(
    () => () => {
      clearInterval(timerRef.current)
      recRef.current?.stream?.getTracks().forEach((t) => t.stop())
    },
    []
  )

  const start = async () => {
    setError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mime = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : ''
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined)
      chunksRef.current = []
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data)
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' })
        const ext = (rec.mimeType || 'audio/webm').includes('ogg') ? 'ogg' : 'webm'
        onChange(new File([blob], `voice.${ext}`, { type: blob.type }))
        stream.getTracks().forEach((t) => t.stop())
      }
      rec.start()
      recRef.current = rec
      setRecording(true)
      setSeconds(0)
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } catch {
      setError(t('voice_no_mic'))
    }
  }

  const stop = () => {
    recRef.current?.stop()
    clearInterval(timerRef.current)
    setRecording(false)
  }

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {canRecord &&
          (recording ? (
            <button
              type="button"
              onClick={stop}
              className="flex items-center gap-2 rounded-xl bg-red-500/90 px-4 py-2 text-sm font-bold"
            >
              <span className="inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
              {t('voice_stop')} · {fmt(seconds)}
            </button>
          ) : (
            <button
              type="button"
              onClick={start}
              className="rounded-xl bg-white/15 px-4 py-2 text-sm font-bold hover:bg-white/25"
            >
              {audio ? t('voice_record_again') : t('voice_record')}
            </button>
          ))}

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20"
        >
          {t('voice_upload')}
        </button>

        {audio && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-xl bg-white/5 px-3 py-2 text-sm font-bold text-white/60 hover:text-white"
          >
            {t('remove')}
          </button>
        )}
      </div>

      {error && <p className="text-sm font-bold text-rose-300">{error}</p>}

      {previewUrl && !recording && (
        <audio src={previewUrl} controls className="w-full" />
      )}

      <input
        ref={fileRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onChange(f)
          e.target.value = ''
        }}
      />
    </div>
  )
}
