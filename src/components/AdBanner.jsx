import { useEffect } from 'react'

export default function AdBanner() {
  useEffect(() => {
    // Trigger Google AdSense to load the ad in this slot on mount
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      // AdSense might fail to load in local development or if blocked by adblockers, which is fine
      console.warn('AdSense notice:', e.message)
    }
  }, [])

  return (
    <div className="w-full my-6 p-2 rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center min-h-[95px] overflow-hidden select-none">
      <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold mb-1">Реклама / Advertisement</span>
      
      {/* 
        This is a standard responsive AdSense unit.
        Replace data-ad-slot="1234567890" with your actual ad slot ID from AdSense dashboard.
      */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minWidth: '250px', textAlign: 'center' }}
        data-ad-client="ca-pub-5467208267803205"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}
