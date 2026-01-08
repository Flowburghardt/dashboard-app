import { motion } from 'framer-motion';
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
  onTimerClick?: () => void;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export function LiveDashboard({ data, recentImages, settings, isLoading, onTimerClick }: LiveDashboardProps) {
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
    <div className="h-full w-full p-6 flex flex-col gap-6 overflow-hidden">
      {/* Top Row: Camera Feed + Rankings (60% height) */}
      <div className="grid grid-cols-3 gap-6 flex-[6] min-h-0 overflow-hidden">
        {/* Camera Feed - Takes 2 columns */}
        <motion.div {...fadeIn} className="col-span-2 min-h-0">
          <CameraFeed
            url={settings.cameraUrl}
            className="h-full"
            showControls
          />
        </motion.div>

        {/* Rankings - Takes 1 column, more entries */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="min-h-0">
          <Rankings
            entries={data?.overall || []}
            className="h-full"
            limit={10}
          />
        </motion.div>
      </div>

      {/* Bottom Row: Recent Uploads + Countdown (40% height) */}
      <div className="grid grid-cols-4 gap-6 flex-[4] min-h-0 overflow-hidden">
        {/* Recent Uploads - Takes 3 columns */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="col-span-3 min-h-0">
          <RecentUploads
            images={recentImages}
            className="h-full"
          />
        </motion.div>

        {/* Countdown Timer - Takes 1 column, right side */}
        <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="min-h-0">
          <CountdownTimer
            endTime={settings.countdownEndTime}
            label={settings.countdownLabel}
            className="h-full"
            onClick={onTimerClick}
          />
        </motion.div>
      </div>
    </div>
  );
}
