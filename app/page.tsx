"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function IndexPage() {
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          crt.sh, but make it <span className="text-primary">✨ actually work ✨</span>
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Compiling data from crt.sh into a nicer, easier to use app.
        </p>
      </div>
      <div className="flex max-w-lg gap-4">
        <Input type="text" id="search" placeholder="Enter a full, or part of a, domain" />
        <Button
          type="submit"
          onClick={() => {
            window.location.href = `/search?domain=${(document.getElementById("search") as HTMLInputElement).value}`
          }}
        >Search</Button>
      </div>
    </section>
  )
}
