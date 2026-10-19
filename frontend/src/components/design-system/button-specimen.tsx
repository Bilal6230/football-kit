"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ButtonSpecimen() {
  const [message, setMessage] = useState("Try a button with a pointer, Enter or Space.");
  return <div>
    <div className="flex flex-wrap items-center gap-4">
      <Button onClick={() => setMessage("Primary button activated.")}>Primary action <span aria-hidden="true">↗</span></Button>
      <Button variant="secondary" onClick={() => setMessage("Secondary button activated.")}>Secondary action</Button>
      <Button variant="text" onClick={() => setMessage("Text button activated.")}>Text action <span aria-hidden="true">→</span></Button>
      <Button disabled>Unavailable</Button>
    </div>
    <p role="status" className="mt-5 text-sm text-muted">{message}</p>
  </div>;
}
