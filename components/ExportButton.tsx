"use client";

import { Button } from "@/components/ui/button";
import { useShifts } from "@/hooks/useShifts";
import { useStaff } from "@/hooks/useStaff";
import { DownloadIcon } from "@radix-ui/react-icons";

export default function ExportButton() {
  const { staffList } = useStaff();
  const { shifts } = useShifts();

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      staff: staffList,
      shifts: shifts,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `shift-data-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" className="gap-2" onClick={handleExport}>
      <DownloadIcon className="w-4 h-4" />
      Export JSON
    </Button>
  );
}
