"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useShifts } from "@/hooks/useShifts";
import { useStaff } from "@/hooks/useStaff";
import { DownloadIcon } from "@radix-ui/react-icons";
import { addDays } from "date-fns";
import { useState } from "react";

interface Props {
  weekStart: Date;
}

export default function ExportButton({ weekStart }: Props) {
  const { staffList } = useStaff();
  const { shifts } = useShifts();
  const [format, setFormat] = useState<"json" | "csv">("json");

  const weekDates = Array.from(
    { length: 7 },
    (_, i) => addDays(weekStart, i).toISOString().split("T")[0]
  );
  const filteredShifts = shifts.filter((s) => weekDates.includes(s.date));

  const handleExport = () => {
    const filename = `shifts-${weekDates[0]}.${format}`;

    if (format === "json") {
      const data = {
        exportedAt: new Date().toISOString(),
        weekStart: weekStart.toISOString(),
        staff: staffList,
        shifts: filteredShifts,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      downloadBlob(blob, filename);
    }

    if (format === "csv") {
      const header = "Date,Staff Name,Start Time,End Time\n";
      const csvRows = filteredShifts.map((shift) => {
        const staff = staffList.find((s) => s.id === shift.staffId);
        return `${shift.date},"${staff?.name ?? "Unknown"}",${shift.startTime},${shift.endTime}`;
      });
      const blob = new Blob([header + csvRows.join("\n")], {
        type: "text/csv",
      });
      downloadBlob(blob, filename);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <DownloadIcon className="w-4 h-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            setFormat("json");
            handleExport();
          }}
        >
          JSON
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setFormat("csv");
            handleExport();
          }}
        >
          CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
