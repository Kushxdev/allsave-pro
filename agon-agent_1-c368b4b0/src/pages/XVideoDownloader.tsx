import LandingPage from './LandingPage';

export default function XVideoDownloader() {
  return (
    <LandingPage
      platform="twitter"
      headline="X (Twitter) Video & GIF Downloader"
      subheadline="Download videos, GIFs and clips from any public X post in original resolution."
      placeholder="Paste an X (Twitter) post link..."
      steps={[
        { title: 'Copy the X post link', desc: 'Tap Share → Copy Link on the post containing the video.' },
        { title: 'Paste & analyze', desc: 'We fetch the real video variants directly from the post.' },
        { title: 'Pick a resolution', desc: 'Choose the highest bitrate variant and download.' },
      ]}
    />
  );
}
