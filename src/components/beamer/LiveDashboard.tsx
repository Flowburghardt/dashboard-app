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
    <div className="h-full w-full p-6 flex flex-col gap-6">
      {/* Top Row: Camera Feed + Rankings (60% height) */}
      <div className="grid grid-cols-3 gap-6 flex-[6]">
        {/* Camera Feed - Takes 2 columns */}
        <motion.div {...fadeIn} className="col-span-2">
          <CameraFeed
            url={settings.cameraUrl}
            className="h-full"
            showControls
          />
        </motion.div>

        {/* Rankings - Takes 1 column, more entries */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }}>
          <Rankings
            entries={data?.overall || []}
            className="h-full"
            limit={10}
          />
        </motion.div>
      </div>

      {/* Bottom Row: Recent Uploads + Countdown (40% height) */}
      <div className="grid grid-cols-4 gap-6 flex-[4]">
        {/* Recent Uploads - Takes 3 columns */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="col-span-3">
          <RecentUploads
            images={recentImages}
            className="h-full"
          />
        </motion.div>

        {/* Countdown Timer - Takes 1 column, right side */}
        <motion.div {...fadeIn} transition={{ delay: 0.3 }}>
          <CountdownTimer
            endTime={settings.countdownEndTime}
            className="h-full"
            label="Nächste Runde"
          />
        </motion.div>
      </div>
    </div>
  );
}
