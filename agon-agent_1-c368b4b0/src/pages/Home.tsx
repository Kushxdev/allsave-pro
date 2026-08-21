import { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import StatsBanner from '../components/StatsBanner';
import RecentDownloads from '../components/RecentDownloads';
import FeaturesGrid from '../components/FeaturesGrid';
import HowItWorks from '../components/HowItWorks';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import BackgroundBlobs from '../components/BackgroundBlobs';
import SeoLinksGrid from '../components/SeoLinksGrid';
import type { Platform } from '../types';

export default function Home() {
  const [filter, setFilter] = useState<Platform | 'all'>('all');

  return (
    <div className="min-h-screen text-white">
      <BackgroundBlobs />
      <Header activeFilter={filter} onFilterChange={setFilter} />
      <Hero />
      <StatsBanner />
      <RecentDownloads />
      <SeoLinksGrid />
      <FeaturesGrid />
      <HowItWorks />
      <FAQ />
      <Footer />
    </div>
  );
}
