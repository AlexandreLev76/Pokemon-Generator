# Styling Guide

This guide establishes the conventions and principles for styling and UI/UX design within the project. Adhering to these guidelines ensures a consistent, beautiful, and high-quality user experience.

## General Principles
- **Aesthetic and Production-Ready:** All designs must be beautiful, not generic, and suitable for a production environment. Prioritize clean, modern, and engaging aesthetics.
- **Functionality and Performance:** Ensure that styling choices enhance, rather than detract from, the application's functionality and performance.
- **Responsiveness:** All components and layouts must be fully responsive, adapting seamlessly across various screen sizes and devices (mobile, tablet, desktop).
- **Accessibility:** Design and implement with accessibility (ARIA attributes) in mind to ensure the application is usable by all users.
- **Cross-Browser Compatibility:** Ensure consistent appearance and behavior across major web browsers.

## Technologies
- **Tailwind CSS:** Utilize Tailwind CSS for all styling. Favor utility classes for rapid development and maintainability. Avoid inline styles where Tailwind classes can be used.
  - **Theming:** Adhere to a cohesive color palette (e.g., gradients for headers, consistent button colors).
  - **Spacing:** Use Tailwind's spacing scale (e.g., `p-4`, `m-2`, `space-x-4`) for consistent layout and rhythm.
  - **Typography:** Follow a clear typographic hierarchy using Tailwind's font-size, font-weight, and line-height utilities.
- **Lucide React Icons:** Use icons exclusively from the `lucide-react` library.
  - **Consistency:** Choose icons that are visually consistent with each other and the overall aesthetic.
  - **Sizing:** Use appropriate sizes (e.g., `h-5 w-5`) for context.
  - **Coloring:** Use Tailwind text color utilities for icons.

## UI Components
- **Buttons:** Use the `Button` component for all interactive buttons. Maintain consistent styling, including hover and focus states, and loading indicators.
- **Modals:** **NEVER** use `alert()`. All informational messages, confirmations, and error displays must use a proper, custom `Modal` component to ensure a consistent and user-friendly experience.
- **Forms & Inputs:** Design form elements (input fields, textareas, file inputs) to be clear, easy to use, and visually integrated with the overall theme. Include clear labels and validation feedback.

## Code Quality
- **Clean and Readable:** Prioritize clean, readable, and well-organized code.
- **Component-Based:** Organize UI into logical, reusable React components.
- **Minimal Updates:** When making changes, keep updates as minimal as possible while satisfying the request.
- **Performance:** Optimize images, animations, and render cycles to ensure a smooth user experience.
