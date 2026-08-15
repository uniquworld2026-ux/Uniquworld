import { useEffect, useMemo, useState } from 'react'
import { Music, Pause, Volume2, VolumeX } from 'lucide-react'
import { youtubeMusicEmbedUrl, youtubeVideoId } from '@/storefront/features/digitalSurprise/mediaEmbeds'
import { cn } from '@/shared/utils/cn'

/**
 * Hidden YouTube player for background music.
 * Autoplay with sound needs a tap — first tap starts / unmutes.
 */
export function YoutubeBackgroundMusic({ url, className }) {
  const videoId = useMemo(() => youtubeVideoId(url), [url])
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    setStarted(false)
    setMuted(false)
  }, [videoId])

  if (!videoId) return null

  const src = youtubeMusicEmbedUrl(url, { autoplay: started, mute: muted })

  return (
    <div className={cn('pointer-events-none', className)}>
      {started && src ? (
        <iframe
          title="Background music"
          src={src}
          allow="autoplay; encrypted-media"
          className="pointer-events-none fixed -left-[9999px] h-px w-px opacity-0"
        />
      ) : null}

      <div className="pointer-events-auto fixed bottom-[max(5.25rem,calc(env(safe-area-inset-bottom)+4.25rem))] left-3 z-[55] sm:bottom-6 sm:left-4">
        {!started ? (
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0a2d4d] px-3.5 py-2 text-xs font-semibold text-white shadow-lg"
          >
            <Music className="h-4 w-4" />
            Play song
          </button>
        ) : (
          <div className="inline-flex items-center gap-1 rounded-full bg-[#0a2d4d]/95 px-1.5 py-1 text-white shadow-lg">
            <button
              type="button"
              onClick={() => setStarted(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Stop music"
            >
              <Pause className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setMuted((v) => !v)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
