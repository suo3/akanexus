
import { describe, it, expect } from 'vitest';
import { generateColorScale, getColorContrast } from '../pages/DesignSystemGenerator/utils/colorUtils';

describe('Color Utilities', () => {
    describe('generateColorScale', () => {
        it('should generate a full scale with 11 steps', () => {
            const scale = generateColorScale('#2563eb'); // blue-600
            expect(Object.keys(scale)).toHaveLength(11);
            expect(scale).toHaveProperty('50');
            expect(scale).toHaveProperty('500');
            expect(scale).toHaveProperty('950');
        });

        it('should preserve the base color at step 500', () => {
            const base = '#ff0000';
            const scale = generateColorScale(base);
            expect(scale[500]).toBe(base);
        });

        it('should generate valid hex codes', () => {
            const scale = generateColorScale('#00ff00');
            expect(scale[50]).toMatch(/^#[0-9a-f]{6}$/i);
            expect(scale[950]).toMatch(/^#[0-9a-f]{6}$/i);
        });
    });

    describe('getColorContrast', () => {
        it('should return white for dark backgrounds', () => {
            expect(getColorContrast('#000000')).toBe('white');
            expect(getColorContrast('#1a1a1a')).toBe('white');
        });

        it('should return black for light backgrounds', () => {
            expect(getColorContrast('#ffffff')).toBe('black');
            expect(getColorContrast('#f0f0f0')).toBe('black');
        });
    });
});
