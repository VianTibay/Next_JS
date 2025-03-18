import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Test Page</h1>
      <Image src="/favicon.ico" alt="logo" width={50} height={50} />
      <Link href="/Userint">
      click me 
  </Link>
  <br />
    <button>
      <Link href="/Home">
      click click me
  </Link>
    </button>

    </div>
  );
}
