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
import CardBuilder from './modules/components/Card';
import ModalBuilder from './modules/components/Modal';
import StateMachineDesigner from './modules/components/StateMachineDesigner';
import PatternLibrary from './modules/components/PatternLibrary';
const FormComponent = () => <div className="p-8"><h1 className="text-2xl font-bold">Form Component</h1><p className="text-muted-foreground mt-2">Coming soon...</p></div>;

// Token modules
import TokenManager from './modules/tokens/TokenManager';
import TokenExport from './modules/tokens/Export';
import FrameworkExports from './modules/tokens/FrameworkExports';

// Documentation modules
import DocumentationPreview from './modules/documentation/Preview';
import AutoDocs from './modules/documentation/AutoDocs';
import GuidelinesEditor from './modules/documentation/GuidelinesEditor';

// Developer modules
import ProjectExport from './modules/developer/ProjectExport';







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
                <Route path="components/card" element={<CardBuilder />} />
                <Route path="components/modal" element={<ModalBuilder />} />
                <Route path="components/state-machine" element={<StateMachineDesigner />} />
                <Route path="components/patterns" element={<PatternLibrary />} />

                {/* Token routes */}
                <Route path="tokens/manager" element={<TokenManager />} />
                <Route path="tokens/export" element={<TokenExport />} />
                <Route path="tokens/frameworks" element={<FrameworkExports />} />

                {/* Documentation routes */}
                <Route path="documentation/preview" element={<DocumentationPreview />} />
                <Route path="documentation/api" element={<AutoDocs />} />
                <Route path="documentation/guidelines" element={<GuidelinesEditor />} />

                {/* Developer routes */}
                <Route path="developer/export" element={<ProjectExport />} />






            </Route>
        </Routes>
    );
};

export default DesignSystemGenerator;
