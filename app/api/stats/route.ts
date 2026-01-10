// app/api/stats/route.ts
import { StatsFetch } from '@/app/types/stats.types';
import { NextResponse } from 'next/server';
import si from 'systeminformation';

export const dynamic = 'force-dynamic'; // Assure que la route n'est pas mise en cache

export async function GET() {
  try {
    // const [cpuLoad, mem, cpuTemp, fsSize, networkStats] = await Promise.all([
    const [cpuLoad, mem, cpuTemp, fsSize, networkStats] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.cpuTemperature(),
      si.fsSize(),
      si.networkStats('wlan0')
    ]) as StatsFetch;

    const data = {
      timestamp: Date.now(),
      cpu: {
        currentLoad: parseFloat(cpuLoad.currentLoad.toFixed(2)),
        avgLoad: parseFloat(cpuLoad.avgLoad.toFixed(2)),
        temp: cpuTemp.main ? parseFloat(cpuTemp.main.toFixed(1)) : null,
      },
      mem: {
        usedGB: parseFloat((mem.used / (1024 * 1024 * 1024)).toFixed(2)),
        totalGB: parseFloat((mem.total / (1024 * 1024 * 1024)).toFixed(2)),
        percent: parseFloat(((mem.used / mem.total) * 100).toFixed(1)),
      },
      disk: fsSize.length > 0 ? {
        // Prend le premier disque monté (généralement la racine ou /data)
        sizeGB: parseFloat((fsSize[0].size / (1024 * 1024 * 1024)).toFixed(2)),
        usedGB: parseFloat((fsSize[0].used / (1024 * 1024 * 1024)).toFixed(2)),
        percent: parseFloat(fsSize[0].use.toFixed(1)),
      } : null,
      network: networkStats.length > 0 ? {
        rx_sec: parseFloat((networkStats[0].rx_sec / 1024).toFixed(2)), // KB/s
        tx_sec: parseFloat((networkStats[0].tx_sec / 1024).toFixed(2)), // KB/s
      } : null,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques système:', error);
    return NextResponse.json({ error: 'Failed to fetch system data' }, { status: 500 });
  }
}