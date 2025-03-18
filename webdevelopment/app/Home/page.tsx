import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
const DashboardHome = () => {
  return (
    <div>
      <h1> Hell world testing api</h1>
      <p>Hello to your </p>
   <main>
        <Link href="/Userint">
        <Button>Click me</Button>
        </Link>
        <Link href="/api">
        <Button>To api </Button>
        </Link>
   </main>
    </div>
  )
}

export default DashboardHome
