import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search, Check } from 'lucide-react';
import { icons, LucideIcon } from 'lucide-react';

// Curated list of commonly useful icons for products
const POPULAR_ICONS = [
  'Package', 'Box', 'Boxes', 'Code', 'Code2', 'Terminal', 'Zap', 'Rocket', 
  'Shield', 'Database', 'Cloud', 'Globe', 'Lock', 'Key', 'Cpu', 'Server', 
  'HardDrive', 'Layers', 'Puzzle', 'Settings', 'Wrench', 'Hammer', 'Tool',
  'Music', 'Music2', 'Headphones', 'Mic', 'Mic2', 'Radio', 'Speaker',
  'Image', 'Camera', 'Video', 'Film', 'Palette', 'Paintbrush', 'Brush',
  'FileText', 'File', 'FileCode', 'Folder', 'FolderOpen', 'Archive',
  'Download', 'Upload', 'Share', 'Link', 'ExternalLink', 'Send',
  'Mail', 'MessageSquare', 'MessageCircle', 'Bell', 'BellRing',
  'Calendar', 'Clock', 'Timer', 'Hourglass', 'Watch',
  'User', 'Users', 'UserPlus', 'UserCheck', 'Contact',
  'Heart', 'Star', 'Bookmark', 'Flag', 'Award', 'Trophy', 'Medal',
  'ShoppingCart', 'ShoppingBag', 'CreditCard', 'Wallet', 'DollarSign',
  'TrendingUp', 'BarChart', 'PieChart', 'LineChart', 'Activity',
  'Sparkles', 'Wand', 'Wand2', 'Brain', 'Lightbulb', 'Flame',
  'Gamepad', 'Gamepad2', 'Joystick', 'Dice1', 'Dice5',
  'Smartphone', 'Tablet', 'Laptop', 'Monitor', 'Tv',
  'Wifi', 'Bluetooth', 'Signal', 'Antenna', 'Satellite',
  'Map', 'MapPin', 'Navigation', 'Compass', 'Route',
  'Building', 'Building2', 'Home', 'Store', 'Factory',
  'Leaf', 'Trees', 'Flower', 'Sun', 'Moon', 'CloudSun',
  'Beaker', 'FlaskConical', 'Atom', 'Dna', 'Microscope',
  'Plug', 'Power', 'Battery', 'BatteryCharging', 'Unplug',
  'Eye', 'EyeOff', 'Glasses', 'Scan', 'ScanLine',
  'Gift', 'PartyPopper', 'Cake', 'Candy', 'Cookie',
];

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Get all available icons or filter by search
  const filteredIcons = useMemo(() => {
    const searchLower = search.toLowerCase();
    
    if (!search) {
      // Show popular icons first when no search
      return POPULAR_ICONS;
    }
    
    // Search through all lucide icons
    const allIconNames = Object.keys(icons).filter(
      (name) => 
        typeof icons[name as keyof typeof icons] === 'function' ||
        (typeof icons[name as keyof typeof icons] === 'object' && '$$typeof' in (icons[name as keyof typeof icons] as any))
    );
    
    return allIconNames.filter((name) => 
      name.toLowerCase().includes(searchLower)
    ).slice(0, 100); // Limit to 100 results for performance
  }, [search]);

  const SelectedIcon = value ? (icons[value as keyof typeof icons] as LucideIcon) : null;

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setOpen(false);
    setSearch('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start gap-3 h-auto py-3"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            {SelectedIcon && <SelectedIcon className="text-primary" size={24} />}
          </div>
          <div className="text-left">
            <div className="font-medium">{value || 'Select icon'}</div>
            <div className="text-xs text-muted-foreground">Click to change</div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-popover border-border" align="start">
        <div className="p-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search icons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary"
            />
          </div>
          {!search && (
            <p className="text-xs text-muted-foreground mt-2">
              Showing popular icons. Search for more options.
            </p>
          )}
        </div>
        <ScrollArea className="h-64">
          <div className="grid grid-cols-6 gap-1 p-2">
            {filteredIcons.map((iconName) => {
              const IconComponent = icons[iconName as keyof typeof icons] as LucideIcon;
              if (!IconComponent) return null;
              
              const isSelected = value === iconName;
              
              return (
                <button
                  key={iconName}
                  onClick={() => handleSelect(iconName)}
                  className={`
                    relative w-10 h-10 rounded-lg flex items-center justify-center
                    transition-colors hover:bg-primary/20
                    ${isSelected ? 'bg-primary/20 ring-2 ring-primary' : 'bg-secondary/50 hover:bg-secondary'}
                  `}
                  title={iconName}
                >
                  <IconComponent size={20} className={isSelected ? 'text-primary' : 'text-foreground'} />
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <Check size={10} className="text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          {filteredIcons.length === 0 && (
            <div className="p-4 text-center text-muted-foreground text-sm">
              No icons found for "{search}"
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default IconPicker;
