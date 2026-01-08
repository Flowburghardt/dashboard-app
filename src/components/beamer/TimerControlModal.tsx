import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, X, Clock, StopCircle } from 'lucide-react';
import type { DashboardSettings } from './types';

interface TimerControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: DashboardSettings;
  onSave: (updates: Partial<DashboardSettings>) => void;
}

const quickStartOptions = [
  { label: '5 Min', minutes: 5 },
  { label: '10 Min', minutes: 10 },
  { label: '15 Min', minutes: 15 },
  { label: '30 Min', minutes: 30 },
  { label: '60 Min', minutes: 60 },
];

export function TimerControlModal({ isOpen, onClose, settings, onSave }: TimerControlModalProps) {
  const [endTime, setEndTime] = useState<string>('');
  const [label, setLabel] = useState<string>('');

  // Initialize form values when modal opens
  useEffect(() => {
    if (isOpen) {
      // Convert ISO string to datetime-local format
      if (settings.countdownEndTime) {
        const date = new Date(settings.countdownEndTime);
        const localDateTime = date.toISOString().slice(0, 16);
        setEndTime(localDateTime);
      } else {
        setEndTime('');
      }
      setLabel(settings.countdownLabel || 'Deadline Uploads');
    }
  }, [isOpen, settings]);

  const handleSave = () => {
    onSave({
      countdownEndTime: endTime ? new Date(endTime).toISOString() : null,
      countdownLabel: label || 'Deadline Uploads',
    });
    onClose();
  };

  const handleQuickStart = (minutes: number) => {
    const newEndTime = new Date(Date.now() + minutes * 60 * 1000);
    onSave({
      countdownEndTime: newEndTime.toISOString(),
      countdownLabel: label || 'Deadline Uploads',
    });
    onClose();
  };

  const handleStop = () => {
    onSave({
      countdownEndTime: null,
    });
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-wyt-bg-card rounded-lg p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Timer className="w-6 h-6 text-wyt-accent" />
                <h2 className="text-xl font-bold text-wyt-text">Timer Einstellungen</h2>
              </div>
              <button
                onClick={onClose}
                className="text-wyt-text-muted hover:text-wyt-text transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* End Time Input */}
            <div className="mb-4">
              <label className="block text-sm text-wyt-text-muted mb-2">
                Endzeitpunkt
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-wyt-text-muted" />
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-wyt-bg border border-wyt-border rounded-lg pl-10 pr-4 py-2 text-wyt-text focus:outline-none focus:border-wyt-accent"
                />
              </div>
            </div>

            {/* Label Input */}
            <div className="mb-6">
              <label className="block text-sm text-wyt-text-muted mb-2">
                Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Deadline Uploads"
                className="w-full bg-wyt-bg border border-wyt-border rounded-lg px-4 py-2 text-wyt-text focus:outline-none focus:border-wyt-accent"
              />
            </div>

            {/* Quick Start Buttons */}
            <div className="mb-6">
              <label className="block text-sm text-wyt-text-muted mb-2">
                Schnellstart
              </label>
              <div className="flex flex-wrap gap-2">
                {quickStartOptions.map((option) => (
                  <button
                    key={option.minutes}
                    onClick={() => handleQuickStart(option.minutes)}
                    className="px-4 py-2 bg-wyt-bg-light hover:bg-wyt-border text-wyt-text rounded-lg text-sm transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <StopCircle className="w-4 h-4" />
                Timer stoppen
              </button>
              <div className="flex-1" />
              <button
                onClick={onClose}
                className="px-4 py-2 bg-wyt-bg-light hover:bg-wyt-border text-wyt-text rounded-lg transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-wyt-accent hover:bg-wyt-accent-hover text-white rounded-lg transition-colors"
              >
                Speichern
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
