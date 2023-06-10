"use client";

import { columns } from "@/app/search/columns";
import { DataTable } from "@/app/search/data-table";
import useSWR from "swr";
import { useSearchParams } from "next/navigation";

export function Certs() {
  const params = useSearchParams();

  const domain = params.get("domain") ?? "";
  const excludeExpired = params.get("excludeExpired") ?? "false";
  const includeSql = params.get("includeSql") ?? "false";

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useSWR(`/api/search?domain=${domain}&excludeExpired=${excludeExpired}&includeSql=${includeSql}`, (apiUrl: string) => fetch(apiUrl).then(res => res.json()));
  if (!data) return null;

  return (
    <>
      {data !== null && (
        <>
          <section className="mx-auto flex max-w-xl justify-center">
            <DataTable columns={columns} data={data} />
          </section>
        </>
      )}
    </>
  )
}
