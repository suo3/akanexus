import React, { useState } from 'react';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Download, Package, CheckCircle2, FileCode } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';

const ProjectExport = () => {
    const { tokens, typography, spacing, shadows, motion, components } = useDesignSystemStore();
    const [activeTab, setActiveTab] = useState('config');
    const [isExporting, setIsExporting] = useState(false);

    const [exportConfig, setExportConfig] = useState({
        // Project setup
        includePackageJson: true,
        includeTailwindConfig: true,
        includeViteConfig: true,
        includeTsConfig: true,

        // Design tokens
        includeTokens: true,
        includeThemeProvider: true,

        // Components
        includeButton: true,
        includeInput: true,
        includeCard: true,
        includeModal: true,

        // Utilities
        includeUtils: true,
        includeHooks: true,

        // Documentation
        includeReadme: true,
        includeExamples: true,
    });

    const generatePackageJson = () => {
        return JSON.stringify({
            name: 'my-design-system',
            version: '1.0.0',
            type: 'module',
            scripts: {
                dev: 'vite',
                build: 'tsc && vite build',
                preview: 'vite preview',
                lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
            },
            dependencies: {
                react: '^18.2.0',
                'react-dom': '^18.2.0',
                'lucide-react': '^0.294.0',
                'class-variance-authority': '^0.7.0',
                clsx: '^2.0.0',
                'tailwind-merge': '^2.1.0',
            },
            devDependencies: {
                '@types/react': '^18.2.43',
                '@types/react-dom': '^18.2.17',
                '@typescript-eslint/eslint-plugin': '^6.14.0',
                '@typescript-eslint/parser': '^6.14.0',
                '@vitejs/plugin-react': '^4.2.1',
                autoprefixer: '^10.4.16',
                eslint: '^8.55.0',
                'eslint-plugin-react-hooks': '^4.6.0',
                'eslint-plugin-react-refresh': '^0.4.5',
                postcss: '^8.4.32',
                tailwindcss: '^3.3.6',
                typescript: '^5.2.2',
                vite: '^5.0.8',
            },
        }, null, 2);
    };

    const generateTailwindConfig = () => {
        return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '${tokens.colors.primary}',
        secondary: '${tokens.colors.secondary}',
        accent: '${tokens.colors.accent}',
        background: '${tokens.colors.background}',
        foreground: '${tokens.colors.foreground}',
        border: '${tokens.colors.border}',
        muted: '${tokens.colors.muted}',
      },
      fontFamily: {
        sans: [${typography.fontFamilies.sans.split(',').map(f => `'${f.trim()}'`).join(', ')}],
        serif: [${typography.fontFamilies.serif.split(',').map(f => `'${f.trim()}'`).join(', ')}],
        mono: [${typography.fontFamilies.mono.split(',').map(f => `'${f.trim()}'`).join(', ')}],
      },
      fontSize: {
        ${Object.entries(typography.fontSizes).map(([key, value]) => `'${key}': '${value}'`).join(',\n        ')}
      },
      fontWeight: {
        ${Object.entries(typography.fontWeights).map(([key, value]) => `'${key}': '${value}'`).join(',\n        ')}
      },
      lineHeight: {
        ${Object.entries(typography.lineHeights).map(([key, value]) => `'${key}': '${value}'`).join(',\n        ')}
      },
      letterSpacing: {
        ${Object.entries(typography.letterSpacing).map(([key, value]) => `'${key}': '${value}'`).join(',\n        ')}
      },
      borderRadius: {
        DEFAULT: '${tokens.radius}rem',
      },
      spacing: {
        ${Object.entries(spacing.scale).map(([key, value]) => `'${key}': '${value}'`).join(',\n        ')}
      },
      boxShadow: {
        ${shadows.levels.map(level => `'${level.name}': '${level.shadow}'`).join(',\n        ')}
      },
      transitionTimingFunction: {
        ${Object.entries(motion.easings).map(([key, value]) => `'${key}': '${value}'`).join(',\n        ')}
      },
      transitionDuration: {
        ${Object.entries(motion.durations).map(([key, value]) => `'${key}': '${value}ms'`).join(',\n        ')}
      },
    },
  },
  plugins: [],
}`;
    };

    const generateViteConfig = () => {
        return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})`;
    };

    const generateTsConfig = () => {
        return JSON.stringify({
            compilerOptions: {
                target: 'ES2020',
                useDefineForClassFields: true,
                lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                module: 'ESNext',
                skipLibCheck: true,
                moduleResolution: 'bundler',
                allowImportingTsExtensions: true,
                resolveJsonModule: true,
                isolatedModules: true,
                noEmit: true,
                jsx: 'react-jsx',
                strict: true,
                noUnusedLocals: true,
                noUnusedParameters: true,
                noFallthroughCasesInSwitch: true,
                baseUrl: '.',
                paths: {
                    '@/*': ['./src/*'],
                },
            },
            include: ['src'],
            references: [{ path: './tsconfig.node.json' }],
        }, null, 2);
    };

    const generateUtilsFile = () => {
        return `import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;
    };

    const generateReadme = () => {
        return `# My Design System

A React design system built with TypeScript, Tailwind CSS, and Vite.

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

### Build

\`\`\`bash
npm run build
\`\`\`

## Components

This design system includes the following components:

${exportConfig.includeButton ? '- **Button**: Versatile button component with multiple variants and sizes' : ''}
${exportConfig.includeInput ? '- **Input**: Form input with validation states and icon support' : ''}
${exportConfig.includeCard ? '- **Card**: Container component with header, content, and footer sections' : ''}
${exportConfig.includeModal ? '- **Modal**: Dialog component with overlay and animations' : ''}

## Design Tokens

All design tokens are defined in \`src/tokens/\`:
- Colors
- Typography
- Spacing
- Shadows
- Motion

## Usage

\`\`\`tsx
import { Button } from './components/Button';

function App() {
  return <Button variant="primary">Click me</Button>;
}
\`\`\`

## Customization

Edit \`tailwind.config.js\` to customize your design tokens.

---

Generated with Design System Generator
`;
    };

    const generateIndexHtml = () => {
        return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Design System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
    };

    const generateMainTsx = () => {
        return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;
    };

    const generateAppTsx = () => {
        return `import React from 'react';
${exportConfig.includeButton ? "import { Button } from './components/Button';" : ''}
${exportConfig.includeInput ? "import { Input } from './components/Input';" : ''}
${exportConfig.includeCard ? "import { Card, CardHeader, CardTitle, CardContent } from './components/Card';" : ''}

function App() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-black tracking-tight">My Design System</h1>
        <p className="text-muted-foreground">
          A collection of reusable components built with React and Tailwind CSS.
        </p>

        ${exportConfig.includeButton ? `
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Buttons</h2>
          <div className="flex gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </div>
        ` : ''}

        ${exportConfig.includeCard ? `
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Cards</h2>
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This is a card component with customizable sections.</p>
            </CardContent>
          </Card>
        </div>
        ` : ''}
      </div>
    </div>
  );
}

export default App;`;
    };

    const generateIndexCss = () => {
        return `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Colors */
  --color-primary: ${tokens.colors.primary};
  --color-secondary: ${tokens.colors.secondary};
  --color-accent: ${tokens.colors.accent};
  --color-background: ${tokens.colors.background};
  --color-foreground: ${tokens.colors.foreground};
  --color-border: ${tokens.colors.border};
  --radius: ${tokens.radius}rem;

  /* Typography */
  --font-sans: ${typography.fontFamilies.sans};
  --font-serif: ${typography.fontFamilies.serif};
  --font-mono: ${typography.fontFamilies.mono};

  /* Spacing */
  ${Object.entries(spacing.scale).map(([key, value]) => `--spacing-${key}: ${value};`).join('\n  ')}

  /* Shadows */
  ${shadows.levels.map(level => `--shadow-${level.name}: ${level.shadow};`).join('\n  ')}
}

body {
  font-family: var(--font-sans);
  background: var(--color-background);
}`;
    };

    const exportProject = async () => {
        setIsExporting(true);
        const zip = new JSZip();

        try {
            // Root files
            if (exportConfig.includePackageJson) {
                zip.file('package.json', generatePackageJson());
            }
            if (exportConfig.includeTailwindConfig) {
                zip.file('tailwind.config.js', generateTailwindConfig());
            }
            if (exportConfig.includeViteConfig) {
                zip.file('vite.config.ts', generateViteConfig());
            }
            if (exportConfig.includeTsConfig) {
                zip.file('tsconfig.json', generateTsConfig());
            }
            if (exportConfig.includeReadme) {
                zip.file('README.md', generateReadme());
            }

            zip.file('index.html', generateIndexHtml());
            zip.file('.gitignore', 'node_modules\ndist\n.env\n');
            zip.file('postcss.config.js', 'export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n}');

            // Source files
            const src = zip.folder('src');
            if (src) {
                src.file('main.tsx', generateMainTsx());
                src.file('App.tsx', generateAppTsx());
                src.file('index.css', generateIndexCss());
                src.file('vite-env.d.ts', '/// <reference types="vite/client" />');

                // Utilities
                if (exportConfig.includeUtils) {
                    const lib = src.folder('lib');
                    if (lib) {
                        lib.file('utils.ts', generateUtilsFile());
                    }
                }

                // Components declaration helper
                const getComponentCode = (type: string, fallback: string) => {
                    const component = components.find(c => c.type === type);
                    if (component && component.code && component.code.react) {
                        return component.code.react;
                    }
                    return fallback;
                };

                // Components - using actual code from store or fallbacks
                const componentsDir = src.folder('components');
                if (componentsDir) {
                    if (exportConfig.includeButton) {
                        const fallbackButton = `import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-primary text-white hover:opacity-90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
`;
                        componentsDir.file('Button.tsx', getComponentCode('button', fallbackButton));
                    }

                    if (exportConfig.includeInput) {
                        const fallbackInput = `import * as React from "react"
import { cn } from "../lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
`;
                        componentsDir.file('Input.tsx', getComponentCode('input', fallbackInput));
                    }

                    if (exportConfig.includeCard) {
                        const fallbackCard = `import * as React from "react"
import { cn } from "../lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
`;
                        componentsDir.file('Card.tsx', getComponentCode('card', fallbackCard));
                    }

                    if (exportConfig.includeModal) {
                        const fallbackModal = `import * as React from "react"
import { cn } from "../lib/utils"

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg rounded-lg bg-background p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <span className="sr-only">Close</span>
          X
        </button>
        {children}
      </div>
    </div>
  );
};
export { Modal }
`;
                        componentsDir.file('Modal.tsx', getComponentCode('modal', fallbackModal));
                    }
                }
            }

            // Generate and download
            const blob = await zip.generateAsync({ type: 'blob' });
            saveAs(blob, 'my-design-system.zip');

            toast.success('Project exported successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            toast.error('Failed to export project');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="max-w-5xl">
                    <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Package className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Export Project</h1>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Download a complete React starter template with your design system
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex">
                <div className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1">
                        <div className="p-8 max-w-5xl">
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList>
                                    <TabsTrigger value="config">Configuration</TabsTrigger>
                                    <TabsTrigger value="preview">Preview</TabsTrigger>
                                </TabsList>

                                <TabsContent value="config" className="space-y-8 mt-6">
                                    {/* Project Setup */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold">Project Setup</h3>
                                        <div className="space-y-3 pl-4 border-l-2">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label className="text-sm font-bold">package.json</Label>
                                                    <p className="text-xs text-muted-foreground">NPM dependencies and scripts</p>
                                                </div>
                                                <Switch
                                                    checked={exportConfig.includePackageJson}
                                                    onCheckedChange={(checked) =>
                                                        setExportConfig({ ...exportConfig, includePackageJson: checked })
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label className="text-sm font-bold">tailwind.config.js</Label>
                                                    <p className="text-xs text-muted-foreground">Tailwind CSS configuration</p>
                                                </div>
                                                <Switch
                                                    checked={exportConfig.includeTailwindConfig}
                                                    onCheckedChange={(checked) =>
                                                        setExportConfig({ ...exportConfig, includeTailwindConfig: checked })
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label className="text-sm font-bold">vite.config.ts</Label>
                                                    <p className="text-xs text-muted-foreground">Vite build configuration</p>
                                                </div>
                                                <Switch
                                                    checked={exportConfig.includeViteConfig}
                                                    onCheckedChange={(checked) =>
                                                        setExportConfig({ ...exportConfig, includeViteConfig: checked })
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label className="text-sm font-bold">tsconfig.json</Label>
                                                    <p className="text-xs text-muted-foreground">TypeScript configuration</p>
                                                </div>
                                                <Switch
                                                    checked={exportConfig.includeTsConfig}
                                                    onCheckedChange={(checked) =>
                                                        setExportConfig({ ...exportConfig, includeTsConfig: checked })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Components */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold">Components</h3>
                                        <div className="space-y-3 pl-4 border-l-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-bold">Button Component</Label>
                                                <Switch
                                                    checked={exportConfig.includeButton}
                                                    onCheckedChange={(checked) =>
                                                        setExportConfig({ ...exportConfig, includeButton: checked })
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-bold">Input Component</Label>
                                                <Switch
                                                    checked={exportConfig.includeInput}
                                                    onCheckedChange={(checked) =>
                                                        setExportConfig({ ...exportConfig, includeInput: checked })
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-bold">Card Component</Label>
                                                <Switch
                                                    checked={exportConfig.includeCard}
                                                    onCheckedChange={(checked) =>
                                                        setExportConfig({ ...exportConfig, includeCard: checked })
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-bold">Modal Component</Label>
                                                <Switch
                                                    checked={exportConfig.includeModal}
                                                    onCheckedChange={(checked) =>
                                                        setExportConfig({ ...exportConfig, includeModal: checked })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    {/* Documentation */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold">Documentation</h3>
                                        <div className="space-y-3 pl-4 border-l-2">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-bold">README.md</Label>
                                                <Switch
                                                    checked={exportConfig.includeReadme}
                                                    onCheckedChange={(checked) =>
                                                        setExportConfig({ ...exportConfig, includeReadme: checked })
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-bold">Example Components</Label>
                                                <Switch
                                                    checked={exportConfig.includeExamples}
                                                    onCheckedChange={(checked) =>
                                                        setExportConfig({ ...exportConfig, includeExamples: checked })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="preview" className="space-y-6 mt-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold">Project Structure</h3>
                                        <div className="p-6 bg-muted rounded-xl font-mono text-sm space-y-1">
                                            <div>📦 my-design-system/</div>
                                            <div className="pl-4">├── 📄 package.json</div>
                                            <div className="pl-4">├── 📄 tailwind.config.js</div>
                                            <div className="pl-4">├── 📄 vite.config.ts</div>
                                            <div className="pl-4">├── 📄 tsconfig.json</div>
                                            <div className="pl-4">├── 📄 README.md</div>
                                            <div className="pl-4">├── 📄 index.html</div>
                                            <div className="pl-4">└── 📁 src/</div>
                                            <div className="pl-8">├── 📄 main.tsx</div>
                                            <div className="pl-8">├── 📄 App.tsx</div>
                                            <div className="pl-8">├── 📄 index.css</div>
                                            <div className="pl-8">├── 📁 components/</div>
                                            {exportConfig.includeButton && <div className="pl-12">├── 📄 Button.tsx</div>}
                                            {exportConfig.includeInput && <div className="pl-12">├── 📄 Input.tsx</div>}
                                            {exportConfig.includeCard && <div className="pl-12">├── 📄 Card.tsx</div>}
                                            {exportConfig.includeModal && <div className="pl-12">└── 📄 Modal.tsx</div>}
                                            <div className="pl-8">└── 📁 lib/</div>
                                            <div className="pl-12">└── 📄 utils.ts</div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold">What's Included</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 border rounded-lg space-y-2">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                <h4 className="font-bold">React + TypeScript</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Modern React setup with full TypeScript support
                                                </p>
                                            </div>

                                            <div className="p-4 border rounded-lg space-y-2">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                <h4 className="font-bold">Tailwind CSS</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Pre-configured with your design tokens
                                                </p>
                                            </div>

                                            <div className="p-4 border rounded-lg space-y-2">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                <h4 className="font-bold">Vite Build Tool</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Lightning-fast development and builds
                                                </p>
                                            </div>

                                            <div className="p-4 border rounded-lg space-y-2">
                                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                <h4 className="font-bold">Ready Components</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Production-ready components with your styling
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-bold">Configuration Preview</h3>
                                            <div className="text-xs text-muted-foreground font-mono">tailwind.config.js</div>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute right-4 top-4">
                                                <FileCode className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <ScrollArea className="h-[300px] w-full rounded-md border bg-muted p-4">
                                                <pre className="text-xs font-mono language-js">
                                                    <code>{generateTailwindConfig()}</code>
                                                </pre>
                                            </ScrollArea>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </ScrollArea>

                    <div className="border-t p-6 bg-card/30">
                        <div className="max-w-5xl flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold">Ready to export?</p>
                                <p className="text-xs text-muted-foreground">
                                    Download a complete React project with your design system
                                </p>
                            </div>
                            <Button onClick={exportProject} disabled={isExporting} size="lg" className="gap-2">
                                {isExporting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Exporting...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4" />
                                        Download Project
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectExport;
