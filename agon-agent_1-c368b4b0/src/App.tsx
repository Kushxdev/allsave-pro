import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import YoutubeShorts from './pages/YoutubeShorts';
import InstagramReels from './pages/InstagramReels';
import XVideoDownloader from './pages/XVideoDownloader';
import WhatsappStatusSaver from './pages/WhatsappStatusSaver';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/youtube-shorts-downloader" element={<YoutubeShorts />} />
          <Route path="/instagram-reels-downloader" element={<InstagramReels />} />
          <Route path="/x-video-downloader" element={<XVideoDownloader />} />
          <Route path="/whatsapp-status-saver" element={<WhatsappStatusSaver />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
