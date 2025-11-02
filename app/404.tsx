"use client";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setEl(document.getElementById("root"));
  }, []);

  return (
    <div className="text-center mt-20">
      <h1>404 - Page Not Found</h1>
    </div>
  );
}
