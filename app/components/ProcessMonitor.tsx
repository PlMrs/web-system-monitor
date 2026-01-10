"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Filter,
} from "lucide-react";
import { fetcher } from "../functions/functions";

type SortConfig = {
  key: string;
  direction: "asc" | "desc";
};

export const ProcessMonitor = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "cpu",
    direction: "desc",
  });

  const {
    data: processes,
    error,
    isLoading,
  } = useSWR("/api/processes", fetcher, {
    refreshInterval: 3000,
  });

  const availableStates = useMemo(() => {
    if (!processes || !Array.isArray(processes)) return [];
    return Array.from(new Set(processes.map((p: any) => p.state)));
  }, [processes]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredProcesses = useMemo(() => {
    if (!processes || !Array.isArray(processes)) return [];

    let filtered = processes.filter((proc) => {
      const matchesSearch =
        proc.name.toLowerCase().includes(search.toLowerCase()) ||
        proc.pid.toString().includes(search);
      const matchesStatus =
        statusFilter === "all" || proc.state === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [processes, search, statusFilter, sortConfig]);

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig.key !== column)
      return <ArrowUpDown className="ml-2 h-3 w-3 opacity-30" />;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  if (isLoading)
    return (
      <div className="p-4 text-slate-500 animate-pulse font-mono">
        Lecture système...
      </div>
    );
  if (error)
    return <div className="p-4 text-red-500 font-mono">Erreur API...</div>;

  return (
    <div className="space-y-4 md:max-w-11/12 lg:max-w-4/5 mx-auto">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Rechercher nom ou PID..."
            className="pl-9 bg-slate-900/50 border-slate-800"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="w-full md:w-50">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-900/50 border-slate-800">
              <Filter className="w-4 h-4 mr-2 text-slate-500" />
              <SelectValue placeholder="État" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
              <SelectItem value="all">Tous les états</SelectItem>
              {availableStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state.charAt(0).toUpperCase() + state.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/30 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800/50 text-[10px] font-bold uppercase">
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead
                className="cursor-pointer hover:text-white"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center">
                  NOM <SortIcon column="name" />
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:text-white"
                onClick={() => requestSort("pid")}
              >
                <div className="flex items-center justify-end">
                  PID <SortIcon column="pid" />
                </div>
              </TableHead>
              <TableHead className="text-right">ÉTAT</TableHead>
              <TableHead
                className="text-right cursor-pointer hover:text-white"
                onClick={() => requestSort("cpu")}
              >
                <div className="flex items-center justify-end">
                  CPU % <SortIcon column="cpu" />
                </div>
              </TableHead>
              <TableHead
                className="text-right cursor-pointer hover:text-white"
                onClick={() => requestSort("mem")}
              >
                <div className="flex items-center justify-end">
                  RAM % <SortIcon column="mem" />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredProcesses.length > 0 ? (
              sortedAndFilteredProcesses.map((proc) => (
                <TableRow
                  key={proc.pid}
                  className="border-slate-800 hover:bg-slate-800/40"
                >
                  <TableCell className="font-medium text-slate-200">
                    {proc.name}
                  </TableCell>
                  <TableCell className="text-right font-mono text-slate-500 text-xs">
                    {proc.pid}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        proc.state === "running"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "text-slate-500"
                      }`}
                    >
                      {proc.state}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono font-bold text-emerald-500">
                    {proc.cpu.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-blue-400">
                    {proc.mem.toFixed(1)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-slate-500 font-mono"
                >
                  Aucun processus trouvé avec ces filtres.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
