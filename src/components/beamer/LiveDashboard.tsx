import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { CameraFeed } from './CameraFeed';
import { CountdownTimer } from './CountdownTimer';
import { Rankings } from './Rankings';
import { RecentUploads } from './RecentUploads';
import type { BeamerData, RecentImage, DashboardSettings } from './types';

interface LiveDashboardProps {
  data: BeamerData | null;
  recentImages: RecentImage[];
  settings: DashboardSettings;
  isLoading: boolean;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export function LiveDashboard({ data, recentImages, settings, isLoading }: LiveDashboardProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-wyt-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-wyt-text-muted text-lg">Dashboard lädt...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-6 grid grid-rows-2 gap-6">
      {/* Top Row: Camera Feed + Rankings */}
      <div className="grid grid-cols-3 gap-6">
        {/* Camera Feed - Takes 2 columns */}
        <motion.div {...fadeIn} className="col-span-2">
          <CameraFeed
            url={settings.cameraUrl}
            className="h-full"
            showControls
          />
        </motion.div>

        {/* Rankings - Takes 1 column */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Rankings
            entries={data?.overall || []}
            className="h-full"
            limit={5}
          />
        </motion.div>
      </div>

      {/* Bottom Row: Recent Uploads + Countdown + Slideshow Link */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Uploads - Takes 2 columns */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="col-span-2">
          <RecentUploads
            images={recentImages}
            className="h-full"
          />
        </motion.div>

        {/* Right Column: Countdown + Slideshow Link */}
        <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="flex flex-col gap-6">
          {/* Countdown Timer */}
          <CountdownTimer
            endTime={settings.countdownEndTime}
            className="flex-1"
            label="Nächste Runde"
          />

          {/* Slideshow Link */}
          <div className="bg-wyt-bg-card rounded-lg p-6 flex flex-col items-center justify-center gap-3">
            <div className="text-center mb-2">
              <p className="text-sm text-wyt-text-muted uppercase tracking-wider mb-1">
                Zur Slideshow
              </p>
            </div>
            <a
              href={settings.slideshowUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-6 py-3 bg-wyt-accent hover:bg-wyt-accent-hover text-white rounded-lg font-medium transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>Öffnen</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
