import React, { useMemo, useState } from 'react';
import { CharacterState, YearLog } from '../types/game';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { TrendingUp, Flame, Wallet, Building, ArrowUpRight, HelpCircle } from 'lucide-react';

interface WealthTrackerProps {
  character: CharacterState;
  logs: YearLog[];
}

interface ChartDataPoint {
  age: number;
  year: number;
  label: string;
  netWorth: number;
  cash: number;
  sapa: number;
  summary: string;
}

// Currency abbreviator for Y-Axis ticks
const formatNairaAbbr = (val: number): string => {
  if (val >= 1_000_000_000) return `₦${(val / 1_000_000_000).toFixed(1)}B`;
  if (val >= 1_000_000) return `₦${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `₦${(val / 1_000).toFixed(0)}k`;
  return `₦${val}`;
};

export const WealthTracker: React.FC<WealthTrackerProps> = ({ character, logs }) => {
  const [showSapaOverlay, setShowSapaOverlay] = useState<boolean>(true);

  // Compute fixed assets valuation (property + vehicles + businesses)
  const currentFixedAssetsValuation = useMemo(() => {
    let sum = 0;
    if (character.home.propertyValue) {
      sum += character.home.propertyValue;
    }
    if (character.vehicle) {
      sum += character.vehicle.resaleValue;
    }
    character.businesses.forEach((b) => {
      sum += b.capitalInvested;
    });
    return sum;
  }, [character]);

  const currentTotalNetWorth = useMemo(() => {
    const cashVal = character.cashNaira + character.cashUSD * character.usdExchangeRate;
    return Math.max(0, cashVal + currentFixedAssetsValuation - character.debtNaira);
  }, [character, currentFixedAssetsValuation]);

  // Transform logs into chronological data points for Recharts
  const chartData: ChartDataPoint[] = useMemo(() => {
    // logs are recorded newest first, so reverse for chronological timeline
    const chronologicalLogs = [...logs].reverse();

    if (chronologicalLogs.length === 0) {
      return [
        {
          age: character.age,
          year: character.year,
          label: `Age ${character.age}`,
          netWorth: currentTotalNetWorth,
          cash: character.cashNaira,
          sapa: character.sapaLevel,
          summary: 'Beginning of adult life journey.',
        },
      ];
    }

    return chronologicalLogs.map((log, index) => {
      // If it's the latest log, factor in current asset equity
      const isLatest = index === chronologicalLogs.length - 1;
      const calculatedNetWorth = isLatest
        ? currentTotalNetWorth
        : log.netWorthNaira;

      return {
        age: log.age,
        year: log.year,
        label: `Age ${log.age}`,
        netWorth: calculatedNetWorth,
        cash: isLatest ? character.cashNaira : log.netWorthNaira,
        sapa: log.sapaLevel,
        summary: log.summary,
      };
    });
  }, [logs, character, currentTotalNetWorth]);

  // Statistics calculation
  const peakNetWorth = useMemo(() => {
    if (chartData.length === 0) return currentTotalNetWorth;
    return Math.max(...chartData.map((d) => d.netWorth));
  }, [chartData, currentTotalNetWorth]);

  const averageSapa = useMemo(() => {
    if (chartData.length === 0) return character.sapaLevel;
    const total = chartData.reduce((acc, curr) => acc + curr.sapa, 0);
    return Math.round(total / chartData.length);
  }, [chartData, character]);

  return (
    <div className="space-y-4">
      {/* Top Financial KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Total Net Worth */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Wallet className="w-3.5 h-3.5 text-emerald-400" /> Current Net Worth
            </span>
          </div>
          <div>
            <span className="font-mono-numbers text-lg font-bold text-emerald-400 block">
              ₦{currentTotalNetWorth.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 font-mono-numbers">
              Cash: ₦{character.cashNaira.toLocaleString()} · Assets: ₦{currentFixedAssetsValuation.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Peak Lifetime Net Worth */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Peak Wealth Milestone
            </span>
          </div>
          <div>
            <span className="font-mono-numbers text-lg font-bold text-amber-300 block">
              ₦{peakNetWorth.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500">
              Highest financial peak recorded
            </span>
          </div>
        </div>

        {/* Sapa Hardship Metric */}
        <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Flame className="w-3.5 h-3.5 text-rose-400" /> Average Sapa Index
            </span>
            <span className="font-mono-numbers text-xs font-semibold text-rose-400">
              {averageSapa}%
            </span>
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-200 block">
              {averageSapa <= 25 ? 'Smooth Sailing (Soft Life)' : averageSapa <= 55 ? 'Tough Hustle (Surviving)' : 'Chronic Hardship (Sapa Choke)'}
            </span>
            <span className="text-[11px] text-slate-500">
              Lifespan financial strain indicator
            </span>
          </div>
        </div>
      </div>

      {/* Chart Container Card */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col">
        {/* Chart Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-800/80">
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Lifespan Net Worth & Sapa Trajectory
            </h3>
            <p className="text-[11px] text-slate-500">
              Annual wealth accumulation in Naira (₦) against financial strain (%)
            </p>
          </div>

          {/* Toggle Sapa Overlay */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSapaOverlay(!showSapaOverlay)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                showSapaOverlay
                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Flame className="w-3 h-3 text-rose-400" />
              <span>Sapa Overlay {showSapaOverlay ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Recharts Area + Line Visualization */}
        <div className="w-full h-64 sm:h-72 pt-2">
          {chartData.length < 2 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <TrendingUp className="w-8 h-8 text-slate-600 mb-2 opacity-50" />
              <p className="text-xs font-semibold text-slate-400">Lifespan Chart Initializing</p>
              <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                Advance your character's age by clicking <strong className="text-amber-400">Age +1 Year</strong> to visualize net worth fluctuations.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />

                {/* X-Axis: Age */}
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />

                {/* Left Y-Axis: Net Worth */}
                <YAxis
                  yAxisId="left"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={formatNairaAbbr}
                />

                {/* Right Y-Axis: Sapa % (Optional) */}
                {showSapaOverlay && (
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    domain={[0, 100]}
                    stroke="#f43f5e"
                    fontSize={10}
                    tickLine={false}
                    axisLine={{ stroke: '#334155' }}
                    tickFormatter={(v) => `${v}%`}
                  />
                )}

                {/* Custom Tooltip */}
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ChartDataPoint;
                      return (
                        <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl text-xs max-w-xs">
                          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                            <span className="font-display font-bold text-amber-400">
                              Age {data.age} · Year {data.year}
                            </span>
                            <span className="text-[10px] text-rose-400 font-semibold">
                              Sapa: {data.sapa}%
                            </span>
                          </div>
                          <div className="space-y-1 mb-2">
                            <div className="flex justify-between font-mono-numbers">
                              <span className="text-slate-400">Net Worth:</span>
                              <span className="font-bold text-emerald-400">
                                ₦{data.netWorth.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between font-mono-numbers text-[11px]">
                              <span className="text-slate-500">Liquid Cash:</span>
                              <span className="text-slate-300">
                                ₦{data.cash.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          {data.summary && (
                            <p className="text-[10px] text-slate-400 italic line-clamp-2 pt-1 border-t border-slate-800/60">
                              "{data.summary}"
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Net Worth Gradient Area */}
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="netWorth"
                  name="Net Worth"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#wealthGradient)"
                />

                {/* Sapa Trendline */}
                {showSapaOverlay && (
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="sapa"
                    name="Sapa Level"
                    stroke="#f43f5e"
                    strokeWidth={1.8}
                    strokeDasharray="4 3"
                    dot={{ r: 2.5, fill: '#f43f5e' }}
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend / Info Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-1 border-t border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Net Worth Area (₦)</span>
            </span>
            {showSapaOverlay && (
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-0.5 bg-rose-500 inline-block" />
                <span>Sapa Hardship Curve (%)</span>
              </span>
            )}
          </div>
          <span className="text-slate-500 font-mono-numbers">
            {chartData.length} Data Points Logged
          </span>
        </div>
      </div>
    </div>
  );
};
