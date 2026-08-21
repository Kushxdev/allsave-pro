import LandingPage from './LandingPage';

export default function YoutubeShorts() {
  return (
    <LandingPage
      platform="youtube"
      headline="YouTube Shorts & Video Downloader"
      subheadline="Paste any YouTube Shorts or video link and download in up to 1080p60, or extract MP3 audio instantly."
      placeholder="Paste a YouTube Shorts or video link..."
      steps={[
        { title: 'Copy the YouTube link', desc: 'Tap Share on any Shorts or video and copy the URL.' },
        { title: 'Paste & analyze', desc: 'Drop it above and hit Fetch Media to load real formats.' },
        { title: 'Choose quality & save', desc: 'Pick 1080p, 720p, 480p or MP3 and download instantly.' },
      ]}
    />
  );
}
