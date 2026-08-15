import { useEffect, useId, useRef, useState } from 'react'
import { Music, Square, Upload, Volume2, VolumeX } from 'lucide-react'
import {
  isDirectAudioUrl,
  youtubeVideoId,
} from '@/storefront/features/digitalSurprise/mediaEmbeds'
import { cn } from '@/shared/utils/cn'

let youtubeApiPromise = null

function loadYoutubeApi() {
  if (typeof window === 'undefined') return Promise.reject(new Error('No window'))
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (youtubeApiPromise) return youtubeApiPromise

  youtubeApiPromise = new Promise((resolve, reject) => {
    const finish = () => {
      if (window.YT?.Player) resolve(window.YT)
      else reject(new Error('YouTube player missing'))
    }
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      try {
        prev?.()
      } catch {
        /* ignore */
      }
      finish()
    }
    if (window.YT?.Player) {
      finish()
      return
    }
    const src = 'https://www.youtube.com/iframe_api'
    if (!document.querySelector(`script[src="${src}"]`)) {
      const tag = document.createElement('script')
      tag.src = src
      tag.async = true
      tag.onerror = () => {
        youtubeApiPromise = null
        reject(new Error('Could not load YouTube'))
      }
      document.head.appendChild(tag)
    }
  })
  return youtubeApiPromise
}

function YoutubeEngine({ videoId, hostId, onReady, playRef, stopRef, muteRef }) {
  const hostRef = useRef(null)
  const playerRef = useRef(null)
  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    let cancelled = false
    playRef.current = () => playerRef.current?.playVideo?.()
    stopRef.current = () => playerRef.current?.stopVideo?.()
    muteRef.current = (muted) => {
      const p = playerRef.current
      if (!p) return
      if (muted) p.mute?.()
      else p.unMute?.()
    }

    loadYoutubeApi()
      .then((YT) => {
        if (cancelled || !hostRef.current) return
        playerRef.current = new YT.Player(hostRef.current, {
          videoId,
          width: 48,
          height: 48,
          host: 'https://www.youtube-nocookie.com',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            loop: 1,
            playlist: videoId,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (cancelled) return
              playerRef.current = event.target
              playRef.current = () => event.target.playVideo()
              stopRef.current = () => event.target.stopVideo()
              muteRef.current = (muted) => {
                if (muted) event.target.mute()
                else event.target.unMute()
              }
              onReadyRef.current?.()
            },
          },
        })
      })
      .catch(() => {
        /* upload is the fallback */
      })

    return () => {
      cancelled = true
      playRef.current = () => {}
      stopRef.current = () => {}
      muteRef.current = () => {}
      try {
        playerRef.current?.stopVideo?.()
        playerRef.current?.destroy?.()
      } catch {
        /* ignore */
      }
      playerRef.current = null
    }
  }, [videoId, playRef, stopRef, muteRef])

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-full opacity-[0.05] [&>iframe]:pointer-events-none [&>iframe]:h-full [&>iframe]:w-full"
      aria-hidden
    >
      <div id={hostId} ref={hostRef} className="h-full w-full" />
    </div>
  )
}

function isAudioFile(file) {
  if (!file) return false
  if (file.type.startsWith('audio/')) return true
  return /\.(mp3|wav|ogg|m4a|aac|webm)$/i.test(file.name)
}

/**
 * Background song for digital surprises.
 * YouTube or uploaded audio — play, stop, and optional file upload.
 */
export function BackgroundMusic({ url, variant = 'overlay', allowUpload, className }) {
  const overlay = variant === 'overlay'
  const canUpload = allowUpload ?? overlay
  const hostId = `yt-bg-${useId().replace(/:/g, '')}`
  const audioRef = useRef(null)
  const fileInputRef = useRef(null)
  const localUrlRef = useRef('')
  const playRef = useRef(() => {})
  const stopRef = useRef(() => {})
  const muteRef = useRef(() => {})
  const playAfterLoad = useRef(false)

  const [localUrl, setLocalUrl] = useState('')
  const [localName, setLocalName] = useState('')
  const [fileError, setFileError] = useState('')
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [readyId, setReadyId] = useState('')

  const activeUrl = localUrl || url || ''
  const videoId = youtubeVideoId(activeUrl)
  const isAudio = isDirectAudioUrl(activeUrl)

  useEffect(() => {
    setPlaying(false)
    setMuted(false)
  }, [activeUrl, videoId])

  useEffect(
    () => () => {
      if (localUrlRef.current) URL.revokeObjectURL(localUrlRef.current)
    },
    [],
  )

  useEffect(() => {
    if (!playAfterLoad.current || !isAudio) return
    playAfterLoad.current = false
    const el = audioRef.current
    if (!el) return
    el.muted = muted
    el.play()
      ?.then(() => setPlaying(true))
      .catch(() => setPlaying(false))
  }, [localUrl, isAudio, muted])

  const ready = isAudio || (videoId && readyId === videoId)

  function play() {
    if (!ready) return
    setPlaying(true)
    if (isAudio) {
      const el = audioRef.current
      if (!el) return
      el.muted = muted
      el.play()?.catch(() => setPlaying(false))
      return
    }
    playRef.current()
    if (muted) muteRef.current(true)
  }

  function stop() {
    setPlaying(false)
    if (isAudio) {
      const el = audioRef.current
      if (!el) return
      el.pause()
      el.currentTime = 0
      return
    }
    stopRef.current()
  }

  function toggleMute() {
    setMuted((v) => {
      const next = !v
      if (isAudio && audioRef.current) audioRef.current.muted = next
      else muteRef.current(next)
      return next
    })
  }

  function applyFile(file) {
    if (!file) return
    if (!isAudioFile(file)) {
      setFileError('Upload an MP3, WAV, OGG, or M4A file')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setFileError('Song must be under 8 MB')
      return
    }
    setFileError('')
    stop()
    if (localUrlRef.current) URL.revokeObjectURL(localUrlRef.current)
    const nextUrl = URL.createObjectURL(file)
    localUrlRef.current = nextUrl
    playAfterLoad.current = true
    setLocalUrl(nextUrl)
    setLocalName(file.name)
  }

  if (!videoId && !isAudio && !canUpload) return null

  const shell = overlay ? 'bg-[#0a2d4d]/95' : 'bg-hm-primary'

  return (
    <div
      className={cn(
        overlay
          ? 'pointer-events-none fixed bottom-[max(1rem,calc(env(safe-area-inset-bottom)+0.75rem))] left-3 z-[55] sm:bottom-5 sm:left-4'
          : 'pointer-events-none',
        className,
      )}
    >
      {isAudio ? (
        <audio ref={audioRef} src={activeUrl} loop playsInline preload="auto" className="sr-only" />
      ) : null}

      {canUpload ? (
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/mp4,audio/aac,audio/webm,.mp3,.wav,.ogg,.m4a,.aac"
          className="sr-only"
          onChange={(e) => {
            applyFile(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      ) : null}

      <div className="pointer-events-auto relative inline-flex flex-col items-start gap-1">
        {videoId && !localUrl ? (
          <YoutubeEngine
            videoId={videoId}
            hostId={hostId}
            onReady={() => setReadyId(videoId)}
            playRef={playRef}
            stopRef={stopRef}
            muteRef={muteRef}
          />
        ) : null}

        <div className={cn('relative z-10 inline-flex items-center gap-1 rounded-full px-1.5 py-1 text-white shadow-lg', shell)}>
          {!playing ? (
            <button
              type="button"
              onClick={play}
              disabled={!ready}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold disabled:opacity-70"
            >
              <Music className="h-4 w-4" />
              {ready ? 'Play song' : videoId ? 'Loading…' : 'Play song'}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={stop}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
                aria-label="Stop music"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </>
          )}
          {canUpload ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-9 items-center gap-1 rounded-full px-2.5 text-xs font-semibold hover:bg-white/10"
              aria-label="Upload song"
            >
              <Upload className="h-3.5 w-3.5" />
              <span className="max-w-[7.5rem] truncate">{localName ? 'Replace' : 'Upload'}</span>
            </button>
          ) : null}
        </div>
        {localName ? (
          <p className="max-w-[14rem] truncate rounded-full bg-white/85 px-2.5 py-0.5 text-[10px] font-semibold text-[#0a2d4d] shadow">
            {localName}
          </p>
        ) : null}
        {fileError ? (
          <p className="rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold text-hm-danger shadow">
            {fileError}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export { BackgroundMusic as YoutubeBackgroundMusic }
