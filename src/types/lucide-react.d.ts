declare module 'lucide-react' {
  import { FC, SVGProps, ForwardRefExoticComponent, RefAttributes } from 'react';

  interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
    color?: string;
    strokeWidth?: string | number;
    className?: string;
  }

  type Icon = ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;

  export const Wifi: Icon;
  export const WifiOff: Icon;
  export const CheckCircle2: Icon;
  export const AlertTriangle: Icon;
  export const ShieldCheck: Icon;
  export const Database: Icon;
  export const Info: Icon;
  export const Loader2: Icon;
  export const ChevronDown: Icon;
  export const ChevronRight: Icon;
  export const ChevronUp: Icon;
  export const HardDrive: Icon;
  export const MapPin: Icon;
  export const MapIcon: Icon;
  export const Navigation: Icon;
  export const Locate: Icon;
  export const AlertCircle: Icon;
  export const CheckCircle: Icon;
  export const Copy: Icon;
  export const Check: Icon;
  export const Leaf: Icon;
  export const BarChart3: Icon;
  export const TrendingUp: Icon;
  export const X: Icon;
  export const Clock: Icon;
  export const Settings: Icon;
  export const Flame: Icon;
  export const Globe2: Icon;
  export const Sprout: Icon;
  export const HelpCircle: Icon;
  export const FileSpreadsheet: Icon;
  export const ArrowRight: Icon;
  export const Globe: Icon;
  export const Download: Icon;
  export const Smartphone: Icon;
  export const ExternalLink: Icon;
  export const Activity: Icon;
  export const Award: Icon;
  export const CircleDot: Icon;
  export const Cloud: Icon;
  export const Plus: Icon;
  export const Minus: Icon;
  export const RefreshCw: Icon;
  export const Trees: Icon;
  export const Satellite: Icon;
}
