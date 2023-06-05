"use client";

import { Button } from "@/components/ui/button";
import { CertItems } from "@/types/cert";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<CertItems>[] = [
  {
    header: "Issuer",
    accessorKey: "issuer_name",
    cell: ({ row }) => <div className="max-w-sm whitespace-pre-line">{row.getValue("issuer_name")}</div>
  },
  {
    //header: "Issuer ID",
    accessorKey: "issuer_ca_id",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Issuer ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("issuer_ca_id")}</div>
  },
  {
    header: "Common Name",
    accessorKey: "common_name",
  },
  {
    header: "Name Value",
    accessorKey: "name_value",
    cell: ({ row }) => <div className="whitespace-pre">{row.getValue("name_value")}</div>
  },
  {
    header: "Entry Timestamp",
    accessorKey: "entry_timestamp",
  },
  {
    header: "Not Before",
    accessorKey: "not_before",
  },
  {
    header: "Not After",
    accessorKey: "not_after",
  },
];
