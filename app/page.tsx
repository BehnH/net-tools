"use client";

import { SearchForm } from "@/components/search-form";
import { Separator } from "@/components/ui/separator"

export default function IndexPage() {
  return (
    <div className="container grid gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
          crt.sh, but make it <span className="text-primary">✨ actually work ✨</span>
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Compiling data from crt.sh into a nicer, easier to use app.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="max-w-xl">
        <SearchForm />
      </div>
    </div>
  )
}
