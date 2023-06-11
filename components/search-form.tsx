"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";

const searchSchema = z.object({
  query: z.string().min(2, {
    message: "Search query must be at least 2 characters long",
  }),
  excludeExpired: z.boolean().optional().default(false),
  includeSql: z.boolean().optional().default(false),
})

type searchSchemaValues = z.infer<typeof searchSchema>;

export function SearchForm() {
  const form = useForm<searchSchemaValues>({
    resolver: zodResolver(searchSchema),
    mode: "onChange",
  });

  function onSubmit(data: searchSchemaValues) {
    return window.location.href = `/search?domain=${(data.query as string).toLowerCase()}&excludeExpired=${data.excludeExpired}&includeSql=${data.includeSql}`
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search Query</FormLabel>
              <FormControl>
                <Input placeholder="google.com" {...field} />
              </FormControl>
              <FormDescription>
                This is the domain you wish to view ceritifcate issuance history for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="space-y-4"
          >
            <div className="flex items-center justify-between space-x-4 px-4">
            <h3 className="mb-4 text-lg font-medium">Search Options</h3>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-4 px-4">
              <FormField
                control={form.control}
                name="excludeExpired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Exclude expired certificates
                      </FormLabel>
                      <FormDescription>
                        Exclude expired certificates from search results.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeSql"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Output SQL
                      </FormLabel>
                      <FormDescription>
                        Output the SQL query used to generate the results.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CollapsibleContent>
          </Collapsible>
        </div>
        <Button type="submit">Search</Button>
      </form>
    </Form>
  )
}
