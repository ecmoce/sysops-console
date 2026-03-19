# sysops-console — Code Map
# Auto-generated | 2026-03-19

## eslint.config.js (23 lines)

## vite.config.ts (13 lines)

## src/App.tsx (27 lines)
  L11: export default function App()

## src/main.tsx (10 lines)

## src/components/ErrorState.tsx (25 lines)
  L8: export default function ErrorState(

## src/components/Layout.tsx (101 lines)
  L15: export default function Layout()
  L22: const load = ...
  L33: const handler = ...

## src/components/MetricBar.tsx (16 lines)
  L3: export default function MetricBar(

## src/components/Pagination.tsx (62 lines)
  L12: export default function Pagination(

## src/components/Shimmer.tsx (33 lines)
  L1: export function ShimmerBlock(
  L7: export function ShimmerCard()
  L19: export function ShimmerTable(

## src/components/StatusDot.tsx (35 lines)
  L9: export default function StatusDot(

## src/lib/api.ts (100 lines)
  L17: export async function getHosts(): Promise<Host[]>
  L21: export async function getHost(hostname: string): Promise<Host | undefined>
  L25: export async function getHostMetrics(hostname: string, metrics: string = 'cpu_usage', hours: number = 1): Promise<Metric...
  L40: export async function getHostAlerts(hostname: string): Promise<AlertRow[]>
  L44: export async function getHostInventory(hostname: string): Promise<InventoryRow>
  L48: export async function getFleetOverview(): Promise<FleetOverview>
  L52: export async function getAllAlerts(): Promise<AlertRow[]>
  L56: export function getHostMetricSnapshot(hostname: string)
  L60: export async function acknowledgeAlert(id: string): Promise<void>
  L70: export async function getHealthChecks(hostname?: string): Promise<HealthCheck[]>
  L72: const fallback = ...
  L76: export async function getHealthCheck(id: string): Promise<HealthCheck | null>
  L80: export async function approveHealthCheck(id: string): Promise<void>
  L84: export async function rejectHealthCheck(id: string): Promise<void>
  L88: export async function executeHealthCheck(id: string, actionIndex?: number): Promise<any>
  L98: export async function getHealthCheckResult(id: string): Promise<any>

## src/lib/types.ts (81 lines)
  L1: export interface Host
  L15: export interface MetricRow
  L23: export interface AlertRow
  L36: export interface InventoryRow
  L43: export interface HealthCheck
  L60: export interface ProposedAction
  L67: export interface ExecutionResult
  L74: export interface FleetOverview

## src/lib/utils.ts (61 lines)
  L1: export function timeAgo(iso: string): string
  L9: export function statusColor(status: string): string
  L19: export function statusBg(status: string): string
  L29: export function severityColor(severity: string): string
  L38: export function severityBgColor(severity: string): string
  L47: export function metricColor(value: number): string
  L53: export function metricBarColor(value: number): string
  L59: export function cn(...classes: (string | false | undefined | null)[]): string

## src/mocks/data.ts (216 lines)
  L4: const ago = ...
  L41: export function generateMetrics(hostname: string, metricName: string, hours: number = 1):
  L94: export function getInventory(hostname: string): InventoryRow
  L96: const host = ...

## src/pages/Alerts.tsx (176 lines)
  L11: export default function Alerts()
  L25: const handler = ...
  L35: const filtered = ...
  L53: const handleAck = ...

## src/pages/Dashboard.tsx (226 lines)
  L25: export default function Dashboard()
  L31: const load = ...
  L41: const activeAlerts = ...
  L47: const timelineData = ...
  L49: const critCount = ...
  L53: const warnCount = ...

## src/pages/HealthChecks.tsx (327 lines)
  L54: const handleExecute = ...
  L123: const handleApprove = ...
  L133: const handleReject = ...
  L143: const handleExecuteAll = ...
  L246: export default function HealthChecks()
  L251: const loadChecks = ...
  L264: const filtered = ...

## src/pages/HostDetail.tsx (406 lines)
  L74: export default function HostDetail()
  L87: const rangeHours = ...
  L116: const activeAlerts = ...

## src/pages/Hosts.tsx (159 lines)
  L10: export default function Hosts()
  L21: const handler = ...
  L31: const filtered = ...

## src/pages/Inventory.tsx (128 lines)
  L9: export default function Inventory()
  L24: const filtered = ...
  L30: const exportCsv = ...
  L32: const rows = ...

## src/pages/SettingsPage.tsx (125 lines)
  L6: export default function SettingsPage()
  L22: const validate = ...
  L32: const handleSave = ...
  L44: const handleReset = ...

## Config Files
  Dockerfile
  README.md
  package.json
