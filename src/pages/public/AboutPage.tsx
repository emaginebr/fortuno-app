import { AboutHero } from '@/components/about/AboutHero';
import { AboutStatsBand } from '@/components/about/AboutStatsBand';
import { AboutMissionEditorial } from '@/components/about/AboutMissionEditorial';
import { AboutValuesPillars } from '@/components/about/AboutValuesPillars';
import { AboutHowWeWorkTimeline } from '@/components/about/AboutHowWeWorkTimeline';
import { AboutClosingCta } from '@/components/about/AboutClosingCta';
import { FraudCertificate } from '@/components/home/FraudCertificate';

export const AboutPage = (): JSX.Element => (
  <div className="bg-dash-page text-fortuno-black">
    <AboutHero />
    <AboutStatsBand />
    <AboutMissionEditorial />
    <AboutValuesPillars />
    <AboutHowWeWorkTimeline />
    <FraudCertificate />
    <AboutClosingCta />
  </div>
);
