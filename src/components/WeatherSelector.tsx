import React from 'react';
import { Sun, Cloud, CloudRain } from 'lucide-react';

interface WeatherSelectorProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
}

const WEATHER_OPTIONS = ['แจ่มใส', 'ครึ้มฝน', 'ฝนตก'] as const;
type WeatherType = typeof WEATHER_OPTIONS[number];

export const WeatherSelector: React.FC<WeatherSelectorProps> = ({ value, onChange, className = '' }) => {
  const normalizeWeather = (val: string): WeatherType => {
    if (!val) return 'แจ่มใส';
    if (val.includes('ฝนตก') || (val.includes('ฝน') && !val.includes('ครึ้ม'))) return 'ฝนตก';
    if (val.includes('ครึ้ม')) return 'ครึ้มฝน';
    return 'แจ่มใส';
  };

  const current = normalizeWeather(value);

  const handleCycle = (e: React.MouseEvent) => {
    e.preventDefault();
    const currentIndex = WEATHER_OPTIONS.indexOf(current);
    const nextIndex = (currentIndex + 1) % WEATHER_OPTIONS.length;
    onChange(WEATHER_OPTIONS[nextIndex]);
  };

  const getConfig = () => {
    switch (current) {
      case 'ฝนตก':
        return {
          label: 'ฝนตก',
          icon: CloudRain,
          style: 'neu-button text-sky-300 hover:text-sky-200',
        };
      case 'ครึ้มฝน':
        return {
          label: 'ครึ้มฝน',
          icon: Cloud,
          style: 'neu-button text-gray-300 hover:text-gray-100',
        };
      case 'แจ่มใส':
      default:
        return {
          label: 'แจ่มใส',
          icon: Sun,
          style: 'neu-button text-orange-400 hover:text-orange-300',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <button
      type="button"
      onClick={handleCycle}
      title="คลิกเพื่อเปลี่ยนสภาพอากาศ (แจ่มใส ➔ ครึ้มฝน ➔ ฝนตก)"
      className={`w-full h-10 px-2 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs transition-all duration-200 active:scale-95 cursor-pointer select-none ${config.style} ${className}`}
    >
      <Icon className="w-4 h-4 flex-shrink-0 animate-pulse" />
      <span className="truncate">{config.label}</span>
    </button>
  );
};
