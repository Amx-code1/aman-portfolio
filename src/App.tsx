
import React, { useEffect, useState, lazy, Suspense, useCallback } from 'react';
import { Preloader } from './components/Preloader/Preloader';
import { IntroCinematic } from './components/IntroCinematic/IntroCinematic';
import { Cursor } from './animations/Cursor';
import { Grain } from './components/Grain/Grain';
import { Navigation } from './components/Navigation/Navigation';
import { MusicToggle } from './components/MusicToggle/MusicToggle';
import { Hero } from './components/Hero/Hero';
import { Marquee } from './animations/Marquee';
import { Footer } from './components/Footer/Footer';
import { AnimationProvider } from './anim/engine/AnimationProvider';
import { AudioProvider } from './audio/AudioProvider';
import { SurpriseProvider } from './features/surprises/SurpriseProvider';
import { Surprises } from './features/surprises/Surprises';
import { works } from './content/works';
import { audio } from './lib/audio';
import { SectionSkeleton } from './components/SectionSkeleton/SectionSkeleton';
import { useDeviceProfile } from './hooks/useDeviceProfile';
import { MobileNav } from './components/MobileNav/MobileNav';
import { ErrorBoundary } from './components/ErrorBoundary/ErrorBoundary';
import { Seo } from './components/Seo/Seo';
import { NotFound } from './components/NotFound/NotFound';
import { defaultSeo, projectSeo, notFoundSeo } from './content/seo';
import { AnalyticsProvider, useAnalytics } from './features/analytics/AnalyticsProvider';
import './App.css';

// ===== Code-split heavy, below-the-fold sections =====
const DynamicEnvironment = lazy(() =>
  import('./components/DynamicEnvironment/DynamicEnvironment').then((m) => ({
    default: m.DynamicEnvironment,
  }))
);
const Story = lazy(() =>
  import('./components/Story/Story').then((m) => ({ default: m.Story }))
);
const About = lazy(() =>
  import('./components/About/About').then((m) => ({ default: m.About }))
);
const Skills = lazy(() =>
  import('./components/Skills/Skills').then((m) => ({ default: m.Skills }))
);
const Works = lazy(() =>
  import('./components/Works/Works').then((m) => ({ default: m.Works }))
);
const Process = lazy(() =>
  import('./components/Process/Process').then((m) => ({ default: m.Process }))
);
const Timeline = lazy(() =>
  import('./components/Timeline/Timeline').then((m) => ({ default: m.Timeline }))
);
const MotionLab = lazy(() =>
  import('./anim/MotionLab').then((m) => ({ default: m.MotionLab }))
);
const Contact = lazy(() =>
  import('./components/Contact/Contact').then((m) => ({ default: m.Contact }))
);
const EndingCinematic = lazy(() =>
  import('./components/EndingCinematic/EndingCinematic').then((m) => ({
    default: m.EndingCinematic,
  }))
);
const ProjectPage = lazy(() =>
  import('./components/Project/ProjectPage').then((m) => ({ default: m.ProjectPage }))
);

type Phase = 'loading' | 'reveal' | 'ready';
type View = { name: 'home' } | { name: 'project'; id: string };

export default function App() {
  return (
    <ErrorBoundary>
      <SurpriseProvider>
        <AnimationProvider>
          <AudioProvider>
            <AnalyticsProvider>
              <Studio />
            </AnalyticsProvider>
          </AudioProvider>
        </AnimationProvider>
      </SurpriseProvider>
    </ErrorBoundary>
  );
}

function Studio() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [view, setView] = useState<View>({ name: 'home' });
  const device = useDeviceProfile();
  const analytics = useAnalytics();
  const [routeLoad, setRouteLoad] = useState(false);

  useEffect(() => {
    document.body.style.overflow = phase === 'ready' ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  useEffect(() => {
    if (phase === 'ready') audio.playSfx('transition');
  }, [phase]);

  const openProject = useCallback((id: string) => {
    audio.playSfx('open');
    setView({ name: 'project', id });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const closeProject = useCallback(() => {
    audio.playSfx('close');
    setView({ name: 'home' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const replay = useCallback(() => {
    audio.playSfx('transition');
    window.scrollTo({ top: 0, behavior: 'auto' });
    setPhase('reveal');
  }, []);

  const currentWork =
    view.name === 'project' ? works.find((w) => w.id === view.id) ?? null : null;
  const nextWork = currentWork
    ? works[(works.findIndex((w) => w.id === currentWork.id) + 1) % works.length]
    : null;

  useEffect(() => {
    setRouteLoad(true);
    const t = window.setTimeout(() => setRouteLoad(false), 700);
    return () => window.clearTimeout(t);
  }, [view]);

  useEffect(() => {
    if (phase === 'ready') {
      analytics.pageView(
        view.name === 'project' && currentWork ? `/work/${currentWork.id}` : '/'
      );
    }
  }, [view, phase, currentWork, analytics]);

  const seo =
    view.name === 'home' ? (
      <Seo data={defaultSeo} />
    ) : currentWork ? (
      <Seo data={projectSeo(currentWork.id, currentWork.title, currentWork.description, currentWork.year)} />
    ) : (
      <Seo data={notFoundSeo} />
    );

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {seo}
      <Suspense fallback={null}>
        <DynamicEnvironment />
      </Suspense>
      <Grain />
      <Cursor />
      {phase !== 'loading' && <MusicToggle />}
      <Navigation
        loaded={phase === 'ready'}
        projectMode={!!currentWork}
        onHome={closeProject}
        disableMobileMenu={device.isMobile}
      />

      {phase === 'loading' && <Preloader onComplete={() => setPhase('reveal')} />}
      {phase === 'reveal' && <IntroCinematic onEnter={() => setPhase('ready')} />}

      <div className={`route-load ${routeLoad ? 'is-on' : ''}`} aria-hidden="true" />

      <main id="main" tabIndex={-1}>
        {currentWork ? (
          <Suspense fallback={<SectionSkeleton label="Loading project case study" />}>
            <ProjectPage
              work={currentWork}
              onBack={closeProject}
              onOpen={openProject}
              next={nextWork}
            />
          </Suspense>
        ) : view.name === 'project' ? (
          <Suspense fallback={<SectionSkeleton label="Loading page" />}>
            <NotFound onHome={closeProject} />
          </Suspense>
        ) : (
          <>
            <Hero active={phase === 'ready'} />
            <Marquee
              items={[
                'ANIME',
                'MOTION DESIGN',
                'WORLD BUILDING',
                '風',
                'STORYTELLING',
                'KEYFRAME CRAFT',
              ]}
              speed={32}
            />
            <Suspense fallback={<SectionSkeleton />}>
              <Story />
              <About />
              <Skills />
              <Works onOpen={openProject} />
              <Process />
              <Timeline />
              <MotionLab />
              <Contact />
              <EndingCinematic onReplay={replay} />
            </Suspense>
          </>
        )}
      </main>
      {phase === 'ready' && !currentWork && device.isMobile && (
        <MobileNav hidden={!!currentWork} />
      )}
      <Footer />
      <Surprises />
    </>
  );
}
