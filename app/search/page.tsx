"use client";

import { Certs } from "@/components/certs";
import { Suspense } from "react";
import { SearchForm } from "@/components/search-form";

export default async function SearchPage() {

  return (
    <>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            crt.sh, but make it <span className="text-primary">✨ actually work ✨</span>
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Compiling data from crt.sh into a nicer, easier to use app.
          </p>
        </div>
        <div className="max-w-xl">
          <SearchForm />
        </div>
      </section>
      <Suspense fallback={<div>Loading...</div>}>
        <Certs />
      </Suspense>
    </>
  )
}
