import React from 'react'; 
 import { useSession } from 'next-auth/react';
// import { redirect } from 'next/navigation';
import LogoutButton  from '@/components/ui/logout';{}


export default function DashboardPage() { 
  return (
    <div>
      <h1>Welcome to your Dashboard 🎉</h1>
      <p>You are now logged in.</p>
      <LogoutButton />
    </div>

  );
}
