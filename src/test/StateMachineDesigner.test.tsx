
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StateMachineDesigner from '../pages/DesignSystemGenerator/modules/components/StateMachineDesigner';
import { BrowserRouter } from 'react-router-dom';

// Mock components that might cause issues in test environment
vi.mock('@/components/ui/scroll-area', () => ({
    ScrollArea: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

vi.mock('@/components/ui/tabs', () => ({
    Tabs: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    TabsTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
    TabsContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        info: vi.fn(),
        error: vi.fn(),
    }
}));

describe('StateMachineDesigner', () => {
    it('renders the component correctly', () => {
        render(
            <BrowserRouter>
                <StateMachineDesigner />
            </BrowserRouter>
        );

        expect(screen.getByText('State Machine Designer')).toBeTruthy();
        expect(screen.getByText('Idle')).toBeTruthy(); // Initial state
        expect(screen.getByText('Loading')).toBeTruthy(); // Initial state
    });

    it('adds a new state when button is clicked', () => {
        render(
            <BrowserRouter>
                <StateMachineDesigner />
            </BrowserRouter>
        );

        const addStateButton = screen.getByTitle('Add State');
        fireEvent.click(addStateButton);

        expect(screen.getByText('New State')).toBeTruthy();
    });

    it('selects a state when clicked', () => {
        render(
            <BrowserRouter>
                <StateMachineDesigner />
            </BrowserRouter>
        );

        const idleState = screen.getByText('Idle');
        fireEvent.mouseDown(idleState);

        expect(screen.getByText('State Configuration')).toBeTruthy();
        // Check if value in input is correct
        expect(screen.getByDisplayValue('Idle')).toBeTruthy();
    });
});
