    // components/LogoutButton.tsx
    import { signOut } from 'next-auth/react';
    import React from 'react';

    const LogoutButton: React.FC = () => {
      const handleLogout = async () => {
        await signOut({ callbackUrl: '/' }); // Redirect to homepage after logout
      };

      return (
        <button onClick={handleLogout}>
          Logout
        </button>
      );
    };

    export default LogoutButton;