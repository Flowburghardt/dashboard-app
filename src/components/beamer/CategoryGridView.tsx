import { useMemo } from 'react';
import { getCategoryStyle } from '../../utils/categoryConfig';
import type { BeamerCategory, BeamerEntry } from './types';

interface CategoryGridViewProps {
  categories: BeamerCategory[];
  overall: BeamerEntry[];
}

// Farbe für "Gesamt" Kategorie
const GESAMT_COLOR = '#F59E0B';

export function CategoryGridView({ categories, overall }: CategoryGridViewProps) {
  // Create "Gesamt" pseudo-category from overall data
  const gesamtCategory: BeamerCategory = {
    id: 0,
    name: 'Gesamt',
    slug: 'gesamt',
    top5: overall.slice(0, 3),
  };

  // Combine regular categories with Gesamt
  const displayCategories = useMemo(() => {
    return [...categories.slice(0, 5), gesamtCategory];
  }, [categories, overall]);

  // Duplicate for seamless loop
  const tickerCategories = [...displayCategories, ...displayCategories];

  return (
    <div className="flex-1 flex items-center overflow-hidden">
      <div
        className="flex gap-10 animate-ticker-grid"
        style={{
          animationDuration: '160s',
        }}
      >
        {tickerCategories.map((category, index) => {
          const style = category.slug === 'gesamt'
            ? { color: GESAMT_COLOR }
            : getCategoryStyle(category.slug);

          return (
            <div
              key={`${category.slug}-${index}`}
              className="flex-shrink-0 bg-wyt-bg-card/40 rounded-2xl p-8 border border-wyt-border/50"
              style={{ borderColor: `${style.color}30` }}
            >
              {/* Category Name */}
              <h2
                className="text-3xl font-bold tracking-wider uppercase mb-6"
                style={{ color: style.color }}
              >
                {category.name}
              </h2>

              {/* Top 3 Images - nebeneinander, größer als Beamer */}
              <div className="flex gap-5">
                {category.top5.slice(0, 3).map((entry) => (
                  <div
                    key={entry.id}
                    className="relative w-[420px] rounded-xl overflow-hidden"
                  >
                    {/* Image - größeres Aspect Ratio */}
                    <div className="aspect-[2/3]">
                      <img
                        src={entry.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Rank Badge */}
                    <div
                      className={`absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                        entry.rank === 1
                          ? 'bg-yellow-500 text-black'
                          : entry.rank === 2
                          ? 'bg-gray-400 text-black'
                          : 'bg-amber-600 text-black'
                      }`}
                    >
                      {entry.rank}
                    </div>

                    {/* Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-2xl font-medium truncate">{entry.user_name}</p>
                      <div className="text-yellow-400 font-bold text-xl">
                        ★ {entry.total_stars}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Placeholder wenn weniger als 3 Einträge */}
                {category.top5.length < 3 &&
                  Array.from({ length: 3 - category.top5.length }).map((_, i) => (
                    <div
                      key={`placeholder-${i}`}
                      className="w-[420px] aspect-[2/3] rounded-xl bg-wyt-bg-light/20 flex items-center justify-center"
                    >
                      <span className="text-wyt-text-muted text-lg">—</span>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes ticker-grid {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-ticker-grid {
          animation: ticker-grid linear infinite;
        }
      `}</style>
    </div>
  );
}
