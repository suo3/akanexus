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
    Save,
    Play,
    RotateCcw,
    Code,
    Box,
    Zap,
    Layout,
    Settings
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
}

const StateMachineDesigner = () => {
    const [states, setStates] = useState<StateNode[]>([
        { id: 'idle', name: 'Idle', type: 'atomic', x: 100, y: 100, events: [] },
        { id: 'loading', name: 'Loading', type: 'atomic', x: 350, y: 100, events: [] },
    ]);
    const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [simulationActive, setSimulationActive] = useState(false);
    const [currentState, setCurrentState] = useState<string>('idle');

    const canvasRef = useRef<HTMLDivElement>(null);

    // Helper to add a new state
    const addState = () => {
        const id = `state_${states.length + 1}`;
        setStates([
            ...states,
            {
                id,
                name: 'New State',
                type: 'atomic',
                x: 100 + Math.random() * 50,
                y: 100 + Math.random() * 50,
                events: []
            }
        ]);
        setSelectedStateId(id);
    };

    // Helper to add an event to the selected state
    const addEvent = () => {
        if (!selectedStateId) return;

        setStates(states.map(state => {
            if (state.id === selectedStateId) {
                return {
                    ...state,
                    events: [
                        ...state.events,
                        { id: `evt_${Date.now()}`, name: 'ON_EVENT', targetId: states[0].id }
                    ]
                };
            }
            return state;
        }));
    };

    // Dragging logic (simplified)
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
        const x = e.clientX - rect.left - 40; // Center offset
        const y = e.clientY - rect.top - 20;

        setStates(states.map(state =>
            state.id === selectedStateId ? { ...state, x, y } : state
        ));
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Simulation logic
    const triggerEvent = (eventName: string, targetId: string) => {
        if (!simulationActive) return;
        console.log(`Transition: ${currentState} --(${eventName})--> ${targetId}`);
        setCurrentState(targetId);
    };

    // Code generation
    const generateXStateCode = () => {
        const machineConfig = {
            id: 'componentMachine',
            initial: states[0]?.id || 'idle',
            states: states.reduce((acc, state) => {
                acc[state.name.toLowerCase().replace(/\s+/g, '_')] = {
                    on: state.events.reduce((evts, evt) => {
                        const target = states.find(s => s.id === evt.targetId)?.name.toLowerCase().replace(/\s+/g, '_');
                        evts[evt.name] = target;
                        return evts;
                    }, {} as Record<string, any>)
                };
                return acc;
            }, {} as Record<string, any>)
        };
        return JSON.stringify(machineConfig, null, 2);
    };

    return (
        <div className="h-full flex flex-col" onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
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
                                setCurrentState(states[0]?.id || 'idle');
                            }}
                            className="gap-2"
                        >
                            {simulationActive ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            {simulationActive ? "Stop Simulation" : "Simulate Logic"}
                        </Button>
                        <Button variant="outline" className="gap-2">
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
                    >
                        <Layout className="w-5 h-5" />
                    </Button>
                    <Separator />
                    <Button variant="ghost" size="icon" title="Settings">
                        <Settings className="w-5 h-5" />
                    </Button>
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

                    {/* Connection Lines (Simplified SVG Visualizaion) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
                            </marker>
                        </defs>
                        {states.map(state =>
                            state.events.map(event => {
                                const target = states.find(s => s.id === event.targetId);
                                if (!target) return null;
                                return (
                                    <line
                                        key={event.id}
                                        x1={state.x + 80}
                                        y1={state.y + 40}
                                        x2={target.x + 80}
                                        y2={target.y + 40}
                                        stroke="#888"
                                        strokeWidth="2"
                                        markerEnd="url(#arrowhead)"
                                        strokeDasharray="4"
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
                            className={`absolute w-40 p-3 rounded-xl border-2 shadow-sm transition-all cursor-${isDragging ? 'grabbing' : 'grab'} ${selectedStateId === state.id
                                    ? 'border-primary ring-2 ring-primary/20 bg-card z-10'
                                    : 'border-border bg-card/80 hover:border-primary/50'
                                } ${simulationActive && currentState === state.id
                                    ? 'ring-4 ring-green-500/30 border-green-500 shadow-green-500/20 shadow-lg scale-105'
                                    : ''
                                }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-bold text-sm truncate">{state.name}</span>
                                {state.type === 'final' && <div className="w-3 h-3 rounded-full border-2 border-black" />}
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
                                            <div className="text-[10px] text-muted-foreground text-center italic">No transitions</div>
                                        )
                                    ) : (
                                        <div className="h-4" /> // Spacer
                                    )}
                                </div>
                            ) : (
                                // Edit Mode: Show connections
                                <div className="space-y-1">
                                    {state.events.map(evt => (
                                        <div key={evt.id} className="text-[10px] flex items-center justify-between bg-muted/50 px-2 py-1 rounded">
                                            <span className="font-mono text-muted-foreground">{evt.name}</span>
                                            <ArrowRight className="w-3 h-3 opacity-50" />
                                        </div>
                                    ))}
                                    {selectedStateId === state.id && (
                                        <div className="text-[10px] text-center text-primary font-bold pt-1 opacity-50">
                                            + Add Transition
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Right Panel - Inspector */}
                <div className="w-80 border-l bg-card/30 flex flex-col">
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
                                                    <div key={evt.id} className="p-3 border rounded-lg bg-card space-y-2">
                                                        <div className="flex items-center gap-2">
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
                                                            />
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
                                                setStates(states.filter(s => s.id !== selectedStateId));
                                                setSelectedStateId(null);
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
