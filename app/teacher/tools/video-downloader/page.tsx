'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Video, Copy, ExternalLink, Download, AlertCircle, CheckCircle } from 'lucide-react'

export default function VideoDownloaderPage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [videoInfo, setVideoInfo] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  const extractVideoId = (url: string) => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(youtubeRegex)
    return match ? match[1] : null
  }

  const analyzeUrl = () => {
    if (!url.trim()) return

    const videoId = extractVideoId(url)
    if (videoId) {
      setVideoInfo({
        platform: 'YouTube',
        id: videoId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`
      })
    } else if (url.includes('vimeo.com')) {
      setVideoInfo({
        platform: 'Vimeo',
        url: url
      })
    } else {
      setVideoInfo({
        platform: 'Unknown',
        url: url
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadServices = [
    {
      name: 'Y2Mate',
      url: 'https://www.y2mate.com',
      description: 'YouTube to MP4 & MP3 converter',
      supports: ['YouTube']
    },
    {
      name: 'SaveFrom.net',
      url: 'https://en.savefrom.net',
      description: 'Download from YouTube, Facebook, Instagram',
      supports: ['YouTube', 'Facebook', 'Instagram']
    },
    {
      name: '9Convert',
      url: 'https://9convert.com',
      description: 'Free YouTube downloader',
      supports: ['YouTube']
    },
    {
      name: 'Clip Converter',
      url: 'https://www.clipconverter.cc',
      description: 'YouTube to MP4, MP3, AVI',
      supports: ['YouTube']
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/teacher/tools')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Tools
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-rose-600" />
                  Video Downloader Helper
                </CardTitle>
                <CardDescription>
                  Get download links for educational videos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold text-yellow-800 dark:text-yellow-400">Important Notice</p>
                      <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                        Due to copyright and Terms of Service restrictions, direct video downloading is not available in-browser. 
                        This tool helps you use external download services legally for educational content.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Video URL
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Paste YouTube, Vimeo, or other video URL..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && analyzeUrl()}
                    />
                    <Button onClick={analyzeUrl} className="bg-rose-600 hover:bg-rose-700">
                      Analyze
                    </Button>
                  </div>
                </div>

                {videoInfo && (
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold">Video Detected: {videoInfo.platform}</span>
                    </div>

                    {videoInfo.thumbnail && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={videoInfo.thumbnail}
                        alt="Video thumbnail"
                        className="w-full rounded-lg mb-4"
                      />
                    )}

                    {videoInfo.embedUrl && (
                      <div className="mb-4">
                        <iframe
                          src={videoInfo.embedUrl}
                          className="w-full aspect-video rounded-lg"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={url}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(url)}
                        >
                          {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Copy the URL above and paste it into one of the download services below.
                      </p>
                    </div>
                  </div>
                )}

                {/* Download Services */}
                <div>
                  <h3 className="font-semibold mb-3">Recommended Download Services</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {downloadServices.map(service => (
                      <a
                        key={service.name}
                        href={service.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-rose-500">
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{service.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">{service.description}</p>
                                <div className="flex gap-1 mt-2">
                                  {service.supports.map(platform => (
                                    <span key={platform} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                      {platform}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <ExternalLink className="w-4 h-4 text-gray-400" />
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <span className="font-bold text-rose-600">1.</span>
                    <span>Copy the video URL from YouTube, Vimeo, or other platforms</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-rose-600">2.</span>
                    <span>Paste it in the input field above and click &quot;Analyze&quot;</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-rose-600">3.</span>
                    <span>Copy the URL again or use one of the download services</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-rose-600">4.</span>
                    <span>Paste the URL into the download service website</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-rose-600">5.</span>
                    <span>Choose quality and format, then download</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Supported Platforms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>YouTube</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Vimeo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Facebook</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Instagram</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Twitter/X</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Legal Notice</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-600 dark:text-gray-400">
                <p className="mb-2">
                  ⚠️ Only download videos that you have permission to use.
                </p>
                <p className="mb-2">
                  ✅ Educational use under Fair Use may be permitted in some jurisdictions.
                </p>
                <p>
                  📚 Always respect copyright laws and terms of service of video platforms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
