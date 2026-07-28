# Summary of Changes

## Full Screen Login and Signup Pages with Centered Text

**Objective:** To make the login and signup interfaces full screen and ensure all text within them is centered.

**Changes Made:**

1.  **Modified `src/components/auth/AuthContainer.tsx`:**
    *   **Full Screen Layout:** Adjusted the main container for the authentication forms to occupy the full width and height of the viewport, ensuring a full-screen experience.
    *   **Centered Text:** Applied `text-center` utility classes to relevant sections within both the login and registration forms to center all textual content.
    *   **Removed Role Selection UI:** The previous UI that allowed users to select a 'Buyer' or 'Seller' role before authentication was removed as per the new design requirement.
    *   **Removed Overlay:** The animated overlay component that transitioned between login and signup forms was removed, streamlining the interface.
    *   **Code Cleanup:** Removed unused state variables (`selectedRole`) and associated functions (`handleRoleSelect`, `handleBackToRoleSelection`) that were related to the removed role selection functionality.
    *   **Registration Payload Update:** Removed the `role` field from the registration API call's payload in `handleRegisterSubmit`, as role selection is no longer part of the frontend flow.

These changes collectively transform the login and signup experience into a more focused, full-screen interface with centralized text for improved aesthetics and usability.