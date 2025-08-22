import React  from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
export default function DashboardPage() {
return(
  <div>
    <h1 className="text-2xl font-bold">Welcome to your Dashboard 🎉</h1>
    <p>You are now logged in.</p>
    <Link href="/login">
      <Button variant="outline">Logout</Button>
    </Link>
  </div>
)

}
