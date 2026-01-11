import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { ProcessMonitor } from "./components/ProcessMonitor";
import { SystemMonitor } from "./components/SystemMonitor";
import { Cpu, Monitor } from "lucide-react";
import { LogoutButton } from "./components/LogoutButton";

export const metadata = {
  title: "Dashboard",
  description: "Monitoring système",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Tabs defaultValue="performance" className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 m-0">
          <TabsList className="bg-slate-900/50">
            <TabsTrigger
              value="performance"
              className="data-[state=active]:bg-slate-800"
            >
              <Monitor className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="process"
              className="data-[state=active]:bg-slate-800"
            >
              <Cpu className="h-4 w-4" />
              Processus
            </TabsTrigger>
          </TabsList>
          <LogoutButton />
        </div>

        <TabsContent
          value="performance"
          className="border-none p-0 outline-none"
        >
          <SystemMonitor />
        </TabsContent>

        <TabsContent value="process" className="border-none p-0 outline-none">
          <ProcessMonitor />
        </TabsContent>
      </Tabs>
    </main>
  );
}
