import React, { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
    Plus,
    Trash2,
    ArrowRight,
    MousePointer2,
    Play,
    RotateCcw,
    Code,
    Box,
    Zap,
    Layout,
    Settings,
    X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Types for our State Machine
interface StateNode {
    id: string;
    name: string;
    type: 'atomic' | 'compound' | 'parallel' | 'final';
    x: number;
    y: number;
    events: StateEvent[];
}

interface StateEvent {
    id: string;
    name: string;
    targetId: string;
    type?: string;
}

interface MachineConfig {
    id: string;
    initial: string;
}

const StateMachineDesigner = () => {
    // Machine Configuration
    const [machineConfig, setMachineConfig] = useState<MachineConfig>({
        id: 'componentMachine',
        initial: 'idle'
    });

    const [states, setStates] = useState<StateNode[]>([
        { id: 'idle', name: 'Idle', type: 'atomic', x: 100, y: 100, events: [] },
        { id: 'loading', name: 'Loading', type: 'atomic', x: 350, y: 100, events: [] },
    ]);
    const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [simulationActive, setSimulationActive] = useState(false);
    const [currentState, setCurrentState] = useState<string>('idle');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const canvasRef = useRef<HTMLDivElement>(null);

    // Sync initial state if the current initial state is deleted
    useEffect(() => {
        // If the initial state is no longer in the list of states, reset it to the first state
        // or keep it if the list is empty (though list shouldn't be empty ideally)
        const initialStateExists = states.find(s => s.id === machineConfig.initial);
        if (!initialStateExists && states.length > 0) {
            setMachineConfig(prev => ({ ...prev, initial: states[0].id }));
        }
    }, [states, machineConfig.initial]);

    // Helper to add a new state
    const addState = () => {
        const id = `state_${states.length + 1}`;
        const newState: StateNode = {
            id,
            name: 'New State',
            type: 'atomic',
            x: 100 + Math.random() * 50,
            y: 100 + Math.random() * 50,
            events: []
        };
        setStates([...states, newState]);
        setSelectedStateId(id);
        toast.success("New state added");
    };

    // Helper to add an event to the selected state
    const addEvent = () => {
        if (!selectedStateId) return;

        setStates(states.map(state => {
            if (state.id === selectedStateId) {
                // Default target is the state itself or the first available state if not itself
                const defaultTarget = states.find(s => s.id !== state.id)?.id || state.id;

                return {
                    ...state,
                    events: [
                        ...state.events,
                        { id: `evt_${Date.now()}`, name: 'ON_EVENT', targetId: defaultTarget }
                    ]
                };
            }
            return state;
        }));
    };

    // Auto Layout Algorithm (Simple Hierarchical)
    const handleAutoLayout = () => {
        const NODE_WIDTH = 180; // Approximate width for spacing calculations
        // const NODE_HEIGHT = 100; // Not used currently
        const LEVEL_SPACING = 250;
        const SIBLING_SPACING = 120;

        // BFS to determine levels
        const levels: Record<string, number> = {};
        const queue: { id: string, level: number }[] = [];

        // Find initial state to start BFS
        const startNodeId = machineConfig.initial || (states.length > 0 ? states[0].id : null);

        if (startNodeId) {
            queue.push({ id: startNodeId, level: 0 });
        }

        const visited = new Set<string>();

        // Initialize all nodes to level 0 (if unreachable or isolated)
        states.forEach(s => levels[s.id] = 0);

        while (queue.length > 0) {
            const { id, level } = queue.shift()!;
            if (visited.has(id)) continue;
            visited.add(id);
            levels[id] = Math.max(levels[id] || 0, level); // Keep max level if visited via multiple paths

            const state = states.find(s => s.id === id);
            if (state) {
                state.events.forEach(evt => {
                    if (!visited.has(evt.targetId)) {
                        queue.push({ id: evt.targetId, level: level + 1 });
                    }
                });
            }
        }

        // Handle disconnected nodes - place them after the connected ones or just at level 0
        // (Current logic leaves them at level 0 if not visited, which might cluster them)
        // We could improved this by vertically stacking disconnected components.

        // Group by level
        const nodesByLevel: Record<number, string[]> = {};
        Object.entries(levels).forEach(([id, level]) => {
            if (!nodesByLevel[level]) nodesByLevel[level] = [];
            nodesByLevel[level].push(id);
        });

        // Assign positions
        const newStates = states.map(state => {
            const level = levels[state.id] || 0;
            const levelNodes = nodesByLevel[level];
            const indexInLevel = levelNodes.indexOf(state.id);

            // Calculate Y to center common levels
            const totalHeight = levelNodes.length * SIBLING_SPACING;
            const startY = 100 + (indexInLevel * SIBLING_SPACING) - (totalHeight / 2) + 200;

            return {
                ...state,
                x: 100 + (level * LEVEL_SPACING),
                y: startY
            };
        });

        setStates(newStates);
        toast.info("Auto layout applied");
    };

    // Dragging logic
    const handleMouseDown = (e: React.MouseEvent, stateId: string) => {
        if (simulationActive) return;
        e.stopPropagation();
        setSelectedStateId(stateId);
        setIsDragging(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !selectedStateId || !canvasRef.current) return;

        // Calculate relative position
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - 80; // Center offset (half of w-40, roughly)
        const y = e.clientY - rect.top - 20;

        setStates(states.map(state =>
            state.id === selectedStateId ? { ...state, x, y } : state
        ));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Stop dragging if mouse leaves the container
    const handleMouseLeave = () => {
        setIsDragging(false);
    }

    // Simulation logic
    const triggerEvent = (eventName: string, targetId: string) => {
        if (!simulationActive) return;
        console.log(`Transition: ${currentState} --(${eventName})--> ${targetId}`);
        setCurrentState(targetId);
    };

    // Code generation
    const generateXStateCode = () => {
        const config = {
            id: machineConfig.id,
            initial: machineConfig.initial || (states[0]?.id || 'idle'),
            states: states.reduce((acc, state) => {
                const stateKey = state.name.toLowerCase().replace(/\s+/g, '_');

                acc[stateKey] = {
                    on: state.events.reduce((evts, evt) => {
                        const target = states.find(s => s.id === evt.targetId)?.name.toLowerCase().replace(/\s+/g, '_');
                        evts[evt.name] = target;
                        return evts;
                    }, {} as Record<string, any>)
                };

                if (state.type === 'final') {
                    acc[stateKey].type = 'final';
                }
                return acc;
            }, {} as Record<string, any>)
        };
        return JSON.stringify(config, null, 2);
    };

    return (
        <div
            className="h-full flex flex-col"
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Header */}
            <div className="border-b px-8 py-6 bg-card/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <MousePointer2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">State Machine Designer</h1>
                            <p className="text-xs text-muted-foreground">
                                Visually design component states and transitions
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={simulationActive ? "destructive" : "default"}
                            onClick={() => {
                                setSimulationActive(!simulationActive);
                                // Reset to initial state when starting simulation
                                if (!simulationActive) {
                                    setCurrentState(machineConfig.initial);
                                }
                            }}
                            className="gap-2"
                        >
                            {simulationActive ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            {simulationActive ? "Stop Simulation" : "Simulate Logic"}
                        </Button>
                        <Button variant="outline" className="gap-2" onClick={() => {
                            navigator.clipboard.writeText(generateXStateCode());
                            toast.success("Config copied to clipboard");
                        }}>
                            <Code className="w-4 h-4" />
                            Export Config
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Toolbar */}
                <div className="w-16 border-r bg-card/30 flex flex-col items-center py-4 gap-4 z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        title="Add State"
                        onClick={addState}
                        disabled={simulationActive}
                    >
                        <Box className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        title="Auto Layout"
                        disabled={simulationActive}
                        onClick={handleAutoLayout}
                    >
                        <Layout className="w-5 h-5" />
                    </Button>
                    <Separator />

                    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" title="Settings" disabled={simulationActive}>
                                <Settings className="w-5 h-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Machine Configuration</DialogTitle>
                                <DialogDescription>
                                    Configure global settings for this state machine.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="machine-id" className="text-right">
                                        ID
                                    </Label>
                                    <Input
                                        id="machine-id"
                                        value={machineConfig.id}
                                        onChange={(e) => setMachineConfig({ ...machineConfig, id: e.target.value })}
                                        className="col-span-3"
                                    />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="initial-state" className="text-right">
                                        Initial State
                                    </Label>
                                    <Select
                                        value={machineConfig.initial}
                                        onValueChange={(val) => setMachineConfig({ ...machineConfig, initial: val })}
                                    >
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select initial state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {states.map(state => (
                                                <SelectItem key={state.id} value={state.id}>
                                                    {state.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setIsSettingsOpen(false)}>Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Canvas */}
                <div
                    ref={canvasRef}
                    className="flex-1 bg-muted/10 relative overflow-hidden cursor-crosshair"
                >
                    {/* Grid Background */}
                    <div
                        className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    />

                    {/* Connection Lines (Bezier Curves) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
                            </marker>
                        </defs>
                        {states.map(state =>
                            state.events.map(event => {
                                const target = states.find(s => s.id === event.targetId);
                                if (!target) return null;

                                // Calculate connection points
                                // Assuming node width 160 (w-40), height ~60-80
                                // Connect from right center of source to left center of target
                                const startX = state.x + 160;
                                const startY = state.y + 45; // Approx center vertical
                                const endX = target.x;
                                const endY = target.y + 45;

                                // Control points for Bezier curve
                                // We pull the curve out horizontally from both points
                                const dist = Math.abs(endX - startX) * 0.5;
                                const controlPoint1X = startX + Math.max(dist, 50);
                                const controlPoint1Y = startY;
                                const controlPoint2X = endX - Math.max(dist, 50);
                                const controlPoint2Y = endY;

                                const pathData = `M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`;

                                return (
                                    <path
                                        key={event.id}
                                        d={pathData}
                                        fill="none"
                                        stroke="#888"
                                        strokeWidth="2"
                                        markerEnd="url(#arrowhead)"
                                        strokeDasharray="4"
                                        className="transition-all duration-300 opacity-90 hover:opacity-100 hover:stroke-primary"
                                    />
                                );
                            })
                        )}
                    </svg>

                    {/* Nodes */}
                    {states.map((state) => (
                        <div
                            key={state.id}
                            onMouseDown={(e) => handleMouseDown(e, state.id)}
                            style={{
                                top: state.y,
                                left: state.x,
                            }}
                            className={`absolute w-40 p-3 rounded-xl border-2 shadow-sm transition-shadow cursor-${isDragging ? 'grabbing' : 'grab'} ${selectedStateId === state.id
                                ? 'border-primary ring-2 ring-primary/20 bg-card z-10'
                                : 'border-border bg-card/90 hover:border-primary/50'
                                } ${simulationActive && currentState === state.id
                                    ? 'ring-4 ring-green-500/30 border-green-500 shadow-green-500/20 shadow-lg scale-105'
                                    : ''
                                } ${state.id === machineConfig.initial ? 'border-t-4 border-t-blue-500' : ''}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-sm truncate select-none" title={state.name}>{state.name}</span>
                                <div className="flex items-center gap-1">
                                    {state.id === machineConfig.initial && (
                                        <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-blue-100 text-blue-700 hover:bg-blue-100 select-none">INIT</Badge>
                                    )}
                                    {state.type === 'final' && <div className="w-3 h-3 rounded-full border-2 border-black bg-black" title="Final State" />}
                                </div>
                            </div>

                            {simulationActive ? (
                                // Simulation Mode: Show triggering buttons
                                <div className="space-y-1">
                                    {currentState === state.id ? (
                                        state.events.length > 0 ? (
                                            state.events.map(evt => (
                                                <button
                                                    key={evt.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        triggerEvent(evt.name, evt.targetId);
                                                    }}
                                                    className="w-full text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 transition-colors flex items-center justify-between font-mono"
                                                >
                                                    {evt.name} <ArrowRight className="w-3 h-3" />
                                                </button>
                                            ))
                                        ) : (
                                            <div className="text-[10px] text-muted-foreground text-center italic select-none">No transitions</div>
                                        )
                                    ) : (
                                        <div className="h-4 flex items-center justify-center">
                                            {state.type !== 'final' && <span className="text-[10px] text-muted-foreground opacity-50 select-none">...</span>}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Edit Mode: Show connections
                                <div className="space-y-1">
                                    {state.events.map(evt => (
                                        <div key={evt.id} className="text-[10px] flex items-center justify-between bg-muted/50 px-2 py-1 rounded">
                                            <span className="font-mono text-muted-foreground truncate max-w-[80px] select-none" title={evt.name}>{evt.name}</span>
                                            <ArrowRight className="w-3 h-3 opacity-50" />
                                        </div>
                                    ))}
                                    {selectedStateId === state.id && (
                                        <div className="text-[10px] text-center text-primary font-bold pt-1 opacity-50 transition-opacity hover:opacity-100 select-none">
                                            + Add Transition
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Panel - Inspector */}
                <div className="w-80 border-l bg-card/30 flex flex-col z-20 shadow-xl">
                    <Tabs defaultValue="properties" className="flex-1 flex flex-col">
                        <div className="p-4 border-b">
                            <TabsList className="w-full">
                                <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
                                <TabsTrigger value="code" className="flex-1">Generated Code</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="properties" className="flex-1 p-0 m-0">
                            <ScrollArea className="h-full">
                                {selectedStateId ? (
                                    <div className="p-4 space-y-6">
                                        {/* State Details */}
                                        <div className="space-y-3">
                                            <Label className="uppercase text-xs font-bold text-muted-foreground tracking-wider">
                                                State Configuration
                                            </Label>
                                            <div className="grid gap-2">
                                                <Label>State Name</Label>
                                                <Input
                                                    value={states.find(s => s.id === selectedStateId)?.name}
                                                    onChange={(e) => setStates(states.map(s =>
                                                        s.id === selectedStateId ? { ...s, name: e.target.value } : s
                                                    ))}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Type</Label>
                                                <div className="flex gap-2">
                                                    {['atomic', 'final'].map(type => (
                                                        <button
                                                            key={type}
                                                            onClick={() => setStates(states.map(s =>
                                                                s.id === selectedStateId ? { ...s, type: type as any } : s
                                                            ))}
                                                            className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors ${states.find(s => s.id === selectedStateId)?.type === type
                                                                ? 'bg-primary text-primary-foreground border-primary'
                                                                : 'hover:bg-muted'
                                                                }`}
                                                        >
                                                            {type}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {selectedStateId !== machineConfig.initial && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full text-xs"
                                                    onClick={() => setMachineConfig({ ...machineConfig, initial: selectedStateId })}
                                                >
                                                    Set as Initial State
                                                </Button>
                                            )}
                                        </div>

                                        <Separator />

                                        {/* Transitions */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="uppercase text-xs font-bold text-muted-foreground tracking-wider">
                                                    Transitions / Events
                                                </Label>
                                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={addEvent}>
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            <div className="space-y-2">
                                                {states.find(s => s.id === selectedStateId)?.events.map((evt, idx) => (
                                                    <div key={evt.id} className="p-3 border rounded-lg bg-card space-y-2 group">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 flex-1">
                                                                <Zap className="w-3 h-3 text-yellow-500" />
                                                                <Input
                                                                    value={evt.name}
                                                                    onChange={(e) => setStates(states.map(s => {
                                                                        if (s.id === selectedStateId) {
                                                                            const newEvents = [...s.events];
                                                                            newEvents[idx] = { ...newEvents[idx], name: e.target.value };
                                                                            return { ...s, events: newEvents };
                                                                        }
                                                                        return s;
                                                                    }))}
                                                                    className="h-7 text-xs font-mono"
                                                                    placeholder="EVENT_NAME"
                                                                />
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() => setStates(states.map(s => {
                                                                    if (s.id === selectedStateId) {
                                                                        return { ...s, events: s.events.filter(ev => ev.id !== evt.id) };
                                                                    }
                                                                    return s;
                                                                }))}
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                                                            <select
                                                                className="flex-1 h-7 text-xs rounded-md border bg-background px-2"
                                                                value={evt.targetId}
                                                                onChange={(e) => setStates(states.map(s => {
                                                                    if (s.id === selectedStateId) {
                                                                        const newEvents = [...s.events];
                                                                        newEvents[idx] = { ...newEvents[idx], targetId: e.target.value };
                                                                        return { ...s, events: newEvents };
                                                                    }
                                                                    return s;
                                                                }))}
                                                            >
                                                                {states.map(s => (
                                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                ))}
                                                {states.find(s => s.id === selectedStateId)?.events.length === 0 && (
                                                    <p className="text-xs text-muted-foreground text-center py-4 border border-dashed rounded-lg">
                                                        No transitions defined
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <Separator />

                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            onClick={() => {
                                                const newStateList = states.filter(s => s.id !== selectedStateId);
                                                setStates(newStateList);
                                                setSelectedStateId(null);
                                                if (selectedStateId === machineConfig.initial && newStateList.length > 0) {
                                                    setMachineConfig({ ...machineConfig, initial: newStateList[0].id });
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete State
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                                        <MousePointer2 className="w-12 h-12 mb-4 opacity-20" />
                                        <p>Select a state to edit its properties and transitions</p>
                                    </div>
                                )}
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="code" className="flex-1 p-0 m-0 overflow-hidden">
                            <ScrollArea className="h-full bg-[#1e1e1e] text-white p-4">
                                <pre className="font-mono text-xs">
                                    {generateXStateCode()}
                                </pre>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default StateMachineDesigner;
