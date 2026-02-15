-- Add Guidelines section to documentation
INSERT INTO public.documentation_sections (title, slug, description, icon, content, order_index, is_published)
VALUES (
  'Guidelines',
  'guidelines',
  'Design principles, accessibility standards, and usage guidelines.',
  'FileText',
  '# Guidelines

Welcome to the Akanexus Design System guidelines. These principles guide our design decisions and ensure a cohesive user experience across all products.

## Core Principles

### 1. Clarity
Our interfaces should be clear and self-explanatory. Users should never have to guess what an element does. Use standard patterns where possible.

### 2. Efficiency
Design for speed and productivity. Minimize the number of clicks required to complete a task.

### 3. Consistency
Maintain visual and functional consistency. Similar elements should look and behave similarly.

### 4. Beauty
Aesthetics matter. A beautiful interface builds trust and makes the product more enjoyable to use.

---

## Accessibility (a11y)

We are committed to building inclusive products. All components must meet **WCAG 2.1 AA** standards.

### Key Requirements
- **Color Contrast**: Text must have a contrast ratio of at least 4.5:1 against its background.
- **Keyboard Navigation**: All interactive elements must be focusable and operable via keyboard.
- **Screen Readers**: Use semantic HTML and ARIA labels where necessary to support assistive technologies.
- **Focus Indicators**: Visible focus states must be present for all interactive elements.

---

## Visual Language

### Typography
We use **Inter** as our primary typeface. It is a variable font that provides excellent legibility at all sizes.

- **Headings**: used for page titles and section headers.
- **Body**: used for standard text, default size is 16px (1rem).
- **Small**: used for captions and secondary text, default size is 14px (0.875rem).

### Color System
Our color system is semantic, meaning colors are defined by their usage rather than their hex values.

- **Primary**: The main brand color, used for primary actions.
- **Secondary**: Used for less prominent actions.
- **Destructive**: Used for dangerous actions (e.g., delete).
- **Muted**: Used for backgrounds anddisabled states.
- **Foreground**: The default text color.

### Spacing
We use an **8pt grid system**. All spacing values (margins, padding, sizing) should be multiples of 8 (or 4 for finer details).

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

---

## Component Usage

### When to use what?

- **Buttons**: Use for actions (e.g., "Submit", "Cancel").
- **Links**: Use for navigation (e.g., "Read more", "Go to profile").
- **Cards**: Use to group related content.
- **Modals**: Use for critical interactions that require focus, but use sparingly.
- **Toasts**: Use for transient feedback messages (e.g., "Saved successfully").

---

## Writing Style

- **Be Concise**: Get to the point quickly.
- **Be Active**: Use active voice (e.g., "Save changes") instead of passive voice (e.g., "Changes were saved").
- **Be Human**: Use natural, conversational language. Avoid jargon.
',
  0,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  content = EXCLUDED.content,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published;
