import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';

// Foundation modules
import ColorsFoundation from './modules/foundation/Colors';
import TypographyFoundation from './modules/foundation/Typography';
import SpacingFoundation from './modules/foundation/Spacing';
import ShadowsFoundation from './modules/foundation/Shadows';
import MotionFoundation from './modules/foundation/Motion';

// Placeholder components for other modules (to be implemented)

// Component modules
import ButtonComponent from './modules/components/Button';
import InputComponent from './modules/components/Input';
import CardComponent from './modules/components/Card';
import ModalComponent from './modules/components/Modal';
const FormComponent = () => <div className="p-8"><h1 className="text-2xl font-bold">Form Component</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>;

// Token modules
import TokenManager from './modules/tokens/TokenManager';
import TokenExport from './modules/tokens/Export';

// Documentation modules
import DocumentationPreview from './modules/documentation/Preview';
const DocGuidelines = () => <div className="p-8"><h1 className="text-2xl font-bold">Guidelines</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>;

// Developer modules
import ProjectExport from './modules/developer/ProjectExport';
const GitHubIntegration = () => <div className="p-8"><h1 className="text-2xl font-bold">GitHub Integration</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>;
const DevTesting = () => <div className="p-8"><h1 className="text-2xl font-bold">Regression Testing</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>;

// Governance modules
import TeamManagement from './modules/governance/TeamManagement';
import MultiBrandManager from './modules/governance/MultiBrandManager';
import Changelog from './modules/governance/Changelog';

// Quality modules
import HealthDashboard from './modules/quality/HealthDashboard';
import AccessibilityChecker from './modules/quality/AccessibilityChecker';
import IconLibrary from './modules/quality/IconLibrary';

const DesignSystemGenerator = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                {/* Default redirect */}
                <Route index element={<Navigate to="foundation/colors" replace />} />

                {/* Foundation routes */}
                <Route path="foundation/colors" element={<ColorsFoundation />} />
                <Route path="foundation/typography" element={<TypographyFoundation />} />
                <Route path="foundation/spacing" element={<SpacingFoundation />} />
                <Route path="foundation/shadows" element={<ShadowsFoundation />} />
                <Route path="foundation/motion" element={<MotionFoundation />} />

                {/* Component routes */}
                <Route path="components/button" element={<ButtonComponent />} />
                <Route path="components/input" element={<InputComponent />} />
                <Route path="components/card" element={<CardComponent />} />
                <Route path="components/modal" element={<ModalComponent />} />

                {/* Token routes */}
                <Route path="tokens/manager" element={<TokenManager />} />
                <Route path="tokens/export" element={<TokenExport />} />

                {/* Documentation routes */}
                <Route path="documentation/preview" element={<DocumentationPreview />} />
                <Route path="documentation/guidelines" element={<DocGuidelines />} />

                {/* Developer routes */}
                <Route path="developer/export" element={<ProjectExport />} />
                <Route path="developer/github" element={<GitHubIntegration />} />
                <Route path="developer/testing" element={<DevTesting />} />

                {/* Governance routes */}
                <Route path="governance/team" element={<TeamManagement />} />
                <Route path="governance/brands" element={<MultiBrandManager />} />
                <Route path="governance/changelog" element={<Changelog />} />

                {/* Quality routes */}
                <Route path="quality/health" element={<HealthDashboard />} />
                <Route path="quality/accessibility" element={<AccessibilityChecker />} />
                <Route path="quality/assets" element={<IconLibrary />} />
            </Route>
        </Routes>
    );
};

export default DesignSystemGenerator;
