import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import leads from "@/seed/leads";

const LeadTable = ({ title, limit }) => {
  const sortedLeads = leads.sort(
    (a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()
  );

  return (
    <div className="grid gap-6 md:grid-cols-2 mt-[20px]">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {title ? title : "Leads"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-md">Name</TableHead>
                <TableHead className="text-md">Email</TableHead>
                <TableHead className="text-md">Phone</TableHead>
                <TableHead className="text-md">Funnel</TableHead>
                <TableHead className="text-md">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLeads.slice(0, limit).map((lead) => (
                <TableRow key={lead.id} className="space-y-4">
                  <TableCell className="py-4">{lead.name}</TableCell>
                  <TableCell className="py-4">{lead.email}</TableCell>
                  <TableCell className="py-4">{lead.phone}</TableCell>
                  <TableCell className="py-4">{lead.funnel}</TableCell>
                  <TableCell className="py-4">{lead.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeadTable;
