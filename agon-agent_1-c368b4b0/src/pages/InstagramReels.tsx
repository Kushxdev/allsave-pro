import LandingPage from './LandingPage';

export default function InstagramReels() {
  return (
    <LandingPage
      platform="instagram"
      headline="Instagram Reels, Stories & Post Downloader"
      subheadline="Save public Reels, Stories and Posts in original quality without any watermark."
      placeholder="Paste an Instagram Reel, Story or Post link..."
      steps={[
        { title: 'Copy the Instagram link', desc: 'Use the Share → Copy Link option on the Reel, Story or Post.' },
        { title: 'Paste & analyze', desc: 'We try to resolve a direct public media URL automatically.' },
        { title: 'Download', desc: 'If the post is public we\'ll surface a direct download; private content will show a clear notice.' },
      ]}
    />
  );
}
