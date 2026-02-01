import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Square, Copy, Download, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface ModalSize {
    id: string;
    name: string;
    width: string;
    maxHeight: string;
}

const ModalComponentBuilder = () => {
    const { tokens } = useDesignSystemStore();
    const [activeTab, setActiveTab] = useState('sizes');
    const [selectedSize, setSelectedSize] = useState('md');
    const [selectedAnimation, setSelectedAnimation] = useState('fade');
    const [showPreview, setShowPreview] = useState(false);

    const [sizes, setSizes] = useState<ModalSize[]>([
        { id: 'sm', name: 'Small', width: '400px', maxHeight: '300px' },
        { id: 'md', name: 'Medium', width: '600px', maxHeight: '500px' },
        { id: 'lg', name: 'Large', width: '800px', maxHeight: '700px' },
        { id: 'xl', name: 'Extra Large', width: '1000px', maxHeight: '900px' },
        { id: 'full', name: 'Full Screen', width: '100vw', maxHeight: '100vh' },
    ]);

    const animations = [
        { id: 'fade', name: 'Fade' },
        { id: 'slide-up', name: 'Slide Up' },
        { id: 'slide-down', name: 'Slide Down' },
        { id: 'zoom', name: 'Zoom' },
    ];

    const [config, setConfig] = useState({
        header: true,
        footer: true,
        closeButton: true,
        closeOnOverlay: true,
        closeOnEscape: true,
        scrollable: true,
        centered: true,
        overlayBlur: true,
    });

    const [overlayConfig, setOverlayConfig] = useState({
        color: '#000000',
        opacity: 0.5,
        blur: 8,
    });

    const generateReactCode = () => {
        return `import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: '${sizes.map((s) => s.id).join("' | '")}';
  animation?: '${animations.map((a) => a.id).join("' | '")}';
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  size = 'md',
  animation = 'fade',
  closeOnOverlay = ${config.closeOnOverlay},
  closeOnEscape = ${config.closeOnEscape},
  children,
}: ModalProps) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const sizes = {
    ${sizes.map((s) => `${s.id}: 'w-[${s.width}] max-h-[${s.maxHeight}]'`).join(',\n    ')}
  };

  const animations = {
    fade: 'animate-in fade-in duration-200',
    'slide-up': 'animate-in slide-in-from-bottom duration-300',
    'slide-down': 'animate-in slide-in-from-top duration-300',
    zoom: 'animate-in zoom-in-95 duration-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 ${config.overlayBlur ? 'backdrop-blur-sm' : ''}"
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative bg-background rounded-[${tokens.radius}rem] shadow-xl',
          '${config.scrollable ? 'overflow-y-auto' : ''}',
          sizes[size],
          animations[animation]
        )}
      >
        {children}
      </div>
    </div>
  );
};

export const ModalHeader = ({ 
  children, 
  onClose 
}: { 
  children: React.ReactNode; 
  onClose?: () => void;
}) => (
  <div className="flex items-center justify-between p-6 border-b">
    <div>{children}</div>
    {onClose && (
      <button
        onClick={onClose}
        className="p-2 hover:bg-muted rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

export const ModalTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-black tracking-tight">{children}</h2>
);

export const ModalDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-muted-foreground mt-1">{children}</p>
);

export const ModalContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6">{children}</div>
);

export const ModalFooter = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-end gap-2 p-6 border-t">
    {children}
  </div>
);
`;
    };

    const copyCode = () => {
        navigator.clipboard.writeText(generateReactCode());
    };

    const currentSize = sizes.find((s) => s.id === selectedSize);

    return (
        <div className="h-full flex">
            {/* Left Panel - Controls */}
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Square className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Modal Builder</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">
                                Component Workbench
                            </p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid grid-cols-3 w-full">
                                <TabsTrigger value="sizes" className="text-xs">Sizes</TabsTrigger>
                                <TabsTrigger value="overlay" className="text-xs">Overlay</TabsTrigger>
                                <TabsTrigger value="config" className="text-xs">Config</TabsTrigger>
                            </TabsList>

                            <TabsContent value="sizes" className="space-y-6 mt-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Modal Sizes
                                    </Label>
                                    <div className="space-y-2">
                                        {sizes.map((size) => (
                                            <button
                                                key={size.id}
                                                onClick={() => setSelectedSize(size.id)}
                                                className={`w-full p-3 rounded-lg border-2 transition-all text-left ${selectedSize === size.id
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-bold">{size.name}</span>
                                                    <span className="text-xs font-mono text-muted-foreground">
                                                        {size.width}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Animation
                                    </Label>
                                    <Select value={selectedAnimation} onValueChange={setSelectedAnimation}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {animations.map((anim) => (
                                                <SelectItem key={anim.id} value={anim.id}>
                                                    {anim.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TabsContent>

                            <TabsContent value="overlay" className="space-y-6 mt-6">
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Overlay Styling
                                    </Label>

                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Color</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={overlayConfig.color}
                                                    onChange={(e) =>
                                                        setOverlayConfig({ ...overlayConfig, color: e.target.value })
                                                    }
                                                    className="w-12 h-9 p-1"
                                                />
                                                <Input
                                                    value={overlayConfig.color}
                                                    onChange={(e) =>
                                                        setOverlayConfig({ ...overlayConfig, color: e.target.value })
                                                    }
                                                    className="flex-1 h-9 font-mono text-xs"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-xs">Opacity</Label>
                                                <span className="text-xs font-mono text-muted-foreground">
                                                    {(overlayConfig.opacity * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.05"
                                                value={overlayConfig.opacity}
                                                onChange={(e) =>
                                                    setOverlayConfig({ ...overlayConfig, opacity: parseFloat(e.target.value) })
                                                }
                                                className="w-full accent-primary"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-xs">Blur</Label>
                                                <span className="text-xs font-mono text-muted-foreground">
                                                    {overlayConfig.blur}px
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="20"
                                                value={overlayConfig.blur}
                                                onChange={(e) =>
                                                    setOverlayConfig({ ...overlayConfig, blur: parseInt(e.target.value) })
                                                }
                                                className="w-full accent-primary"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="config" className="space-y-6 mt-6">
                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Modal Structure
                                    </Label>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Header</Label>
                                            <Switch
                                                checked={config.header}
                                                onCheckedChange={(checked) => setConfig({ ...config, header: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Footer</Label>
                                            <Switch
                                                checked={config.footer}
                                                onCheckedChange={(checked) => setConfig({ ...config, footer: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Close Button</Label>
                                            <Switch
                                                checked={config.closeButton}
                                                onCheckedChange={(checked) => setConfig({ ...config, closeButton: checked })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <Label className="text-xs font-bold uppercase tracking-wider opacity-60">
                                        Behavior
                                    </Label>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Close on Overlay Click</Label>
                                            <Switch
                                                checked={config.closeOnOverlay}
                                                onCheckedChange={(checked) =>
                                                    setConfig({ ...config, closeOnOverlay: checked })
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Close on Escape</Label>
                                            <Switch
                                                checked={config.closeOnEscape}
                                                onCheckedChange={(checked) =>
                                                    setConfig({ ...config, closeOnEscape: checked })
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Scrollable</Label>
                                            <Switch
                                                checked={config.scrollable}
                                                onCheckedChange={(checked) => setConfig({ ...config, scrollable: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Centered</Label>
                                            <Switch
                                                checked={config.centered}
                                                onCheckedChange={(checked) => setConfig({ ...config, centered: checked })}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm">Overlay Blur</Label>
                                            <Switch
                                                checked={config.overlayBlur}
                                                onCheckedChange={(checked) => setConfig({ ...config, overlayBlur: checked })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </ScrollArea>

                <div className="border-t p-4 space-y-2">
                    <Button onClick={copyCode} variant="outline" className="w-full gap-2">
                        <Copy className="w-4 h-4" />
                        Copy React Code
                    </Button>
                    <Button className="w-full gap-2">
                        <Download className="w-4 h-4" />
                        Export Component
                    </Button>
                </div>
            </div>

            {/* Right Panel - Preview */}
            <div className="flex-1 flex flex-col">
                <div className="border-b px-8 py-5 bg-card/30">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            Live Preview
                        </h3>
                        <Button onClick={() => setShowPreview(!showPreview)}>
                            {showPreview ? 'Close' : 'Open'} Modal
                        </Button>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-12 space-y-12">
                        {/* Preview Trigger */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                Interactive Preview
                            </h4>
                            <div className="p-12 border-2 border-dashed rounded-xl flex items-center justify-center">
                                <Button onClick={() => setShowPreview(true)} size="lg">
                                    Open Modal Preview
                                </Button>
                            </div>
                        </div>

                        <Separator />

                        {/* All Sizes */}
                        <div className="space-y-6">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                Modal Sizes
                            </h4>
                            <div className="space-y-4">
                                {sizes.filter((s) => s.id !== 'full').map((size) => (
                                    <div key={size.id} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold">{size.name}</span>
                                            <span className="text-xs font-mono text-muted-foreground">{size.width}</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                style={{ width: `${(parseInt(size.width) / 1000) * 100}%` }}
                                                className="h-full bg-primary"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Code Preview */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                    Generated Code
                                </h4>
                                <Button size="sm" variant="ghost" onClick={copyCode} className="gap-2">
                                    <Copy className="w-3 h-3" />
                                    Copy
                                </Button>
                            </div>
                            <pre className="text-xs font-mono bg-muted p-6 rounded-xl overflow-x-auto max-h-96 overflow-y-auto">
                                {generateReactCode()}
                            </pre>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Modal Preview Overlay */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundColor: overlayConfig.color,
                            opacity: overlayConfig.opacity,
                            backdropFilter: config.overlayBlur ? `blur(${overlayConfig.blur}px)` : 'none',
                        }}
                        onClick={config.closeOnOverlay ? () => setShowPreview(false) : undefined}
                    />
                    <div
                        className="relative bg-background rounded-xl shadow-2xl"
                        style={{
                            width: currentSize?.width,
                            maxHeight: currentSize?.maxHeight,
                            overflow: config.scrollable ? 'auto' : 'hidden',
                        }}
                    >
                        {config.header && (
                            <div className="flex items-center justify-between p-6 border-b">
                                <div>
                                    <h2 className="text-xl font-black tracking-tight">Modal Title</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Modal description</p>
                                </div>
                                {config.closeButton && (
                                    <button
                                        onClick={() => setShowPreview(false)}
                                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="p-6">
                            <p className="text-sm mb-4">
                                This is the modal content area. You can put any content here including forms,
                                images, or other components.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                The modal is {selectedSize} size with {selectedAnimation} animation.
                            </p>
                        </div>

                        {config.footer && (
                            <div className="flex items-center justify-end gap-2 p-6 border-t">
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className="px-4 py-2 border-2 rounded font-bold text-sm"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 bg-primary text-primary-foreground rounded font-bold text-sm">
                                    Confirm
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModalComponentBuilder;
