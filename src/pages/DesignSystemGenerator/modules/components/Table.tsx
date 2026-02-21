import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Table2, Copy, Download, ChevronUp, ChevronDown, ChevronsUpDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDesignSystemStore } from '../../store/useDesignSystemStore';

const TableBuilder = () => {
    const { tokens } = useDesignSystemStore();
    const [config, setConfig] = useState({
        style: 'default' as 'default' | 'bordered' | 'striped' | 'ghost',
        size: 'md' as 'sm' | 'md' | 'lg',
        showHeader: true,
        stickyHeader: false,
        sortable: true,
        selectable: true,
        showPagination: true,
        showSearch: true,
        rowsPerPage: 5,
        rounded: true,
        showActions: true,
        pageCount: 5,
    });

    const [sortCol, setSortCol] = useState<string | null>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [selected, setSelected] = useState<Set<number>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const allData = [
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', joined: '2024-01-15' },
        { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Developer', status: 'Active', joined: '2024-02-20' },
        { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Designer', status: 'Inactive', joined: '2024-03-05' },
        { id: 4, name: 'Dave Brown', email: 'dave@example.com', role: 'Manager', status: 'Active', joined: '2023-11-10' },
        { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Developer', status: 'Pending', joined: '2024-04-18' },
        { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'Designer', status: 'Active', joined: '2023-09-22' },
        { id: 7, name: 'Grace Wilson', email: 'grace@example.com', role: 'Admin', status: 'Active', joined: '2024-05-30' },
        { id: 8, name: 'Henry Moore', email: 'henry@example.com', role: 'Developer', status: 'Inactive', joined: '2023-12-01' },
    ];

    const cols = [
        { key: 'name', label: 'Name', sortable: true },
        { key: 'email', label: 'Email', sortable: true },
        { key: 'role', label: 'Role', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'joined', label: 'Joined', sortable: true },
    ];

    const filtered = allData.filter(r => !searchQuery || Object.values(r).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase())));
    const sorted = sortCol ? [...filtered].sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sortCol]);
        const bv = String((b as Record<string, unknown>)[sortCol]);
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }) : filtered;
    const pageData = sorted.slice((currentPage - 1) * config.rowsPerPage, currentPage * config.rowsPerPage);
    const totalPages = Math.max(1, Math.ceil(sorted.length / config.rowsPerPage));

    const handleSort = (key: string) => {
        if (!config.sortable) return;
        if (sortCol === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortCol(key); setSortDir('asc'); }
    };

    const statusColors: Record<string, { bg: string; color: string }> = {
        Active: { bg: '#22c55e20', color: '#16a34a' },
        Inactive: { bg: '#94a3b820', color: '#64748b' },
        Pending: { bg: '#f59e0b20', color: '#d97706' },
    };

    const rowPad = { sm: '8px 12px', md: '12px 16px', lg: '16px 20px' };
    const fontSize = { sm: 12, md: 13, lg: 14 };

    const getBorderStyle = () => {
        if (config.style === 'bordered') return '1px solid var(--border)';
        return 'none';
    };

    const getRowBg = (i: number) => {
        if (selected.has(pageData[i].id)) return tokens.colors.primary + '12';
        if (config.style === 'striped' && i % 2 === 1) return 'var(--muted)';
        return 'transparent';
    };

    const generateReactCode = () => `import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface Column<T> { key: keyof T; label: string; sortable?: boolean; render?: (value: T[keyof T], row: T) => React.ReactNode; }
interface DataTableProps<T extends { id: string | number }> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  sortable?: boolean;
  selectable?: boolean;
  pageSize?: number;
  striped?: boolean;
  bordered?: boolean;
}

export function DataTable<T extends { id: string | number }>({ data, columns, searchable, sortable, selectable, pageSize = 10, striped, bordered }: DataTableProps<T>) {
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [page, setPage] = useState(1);

  const filtered = data.filter(r => !q || columns.some(c => String(r[c.key]).toLowerCase().includes(q.toLowerCase())));
  const sorted = sortKey ? [...filtered].sort((a, b) => { const av = String(a[sortKey]), bv = String(b[sortKey]); return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av); }) : filtered;
  const pageData = sorted.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  return (
    <div className="space-y-3">
      {searchable && <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..." className="w-full border rounded-lg px-3 py-2 text-sm" />}
      <div className={cn('overflow-x-auto', bordered && 'border rounded-xl')}>
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              {selectable && <th className="px-4 py-3 w-10"><input type="checkbox" checked={selected.size === pageData.length} onChange={e => setSelected(e.target.checked ? new Set(pageData.map(r => r.id)) : new Set())} /></th>}
              {columns.map(col => (
                <th key={String(col.key)} onClick={() => col.sortable && sortable && (setSortKey(col.key), setSortDir(d => d === 'asc' ? 'desc' : 'asc'))} className={cn('px-4 py-3 text-left font-bold text-xs uppercase tracking-wider', col.sortable && sortable && 'cursor-pointer select-none hover:bg-muted/80')}>
                  <div className="flex items-center gap-1">{col.label}{col.sortable && sortable && (sortKey === col.key ? (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <span className="opacity-30">↕</span>)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, i) => (
              <tr key={row.id} className={cn('border-t border-border hover:bg-muted/40 transition-colors', striped && i % 2 === 1 && 'bg-muted/30', selected.has(row.id) && 'bg-primary/5')}>
                {selectable && <td className="px-4 py-3"><input type="checkbox" checked={selected.has(row.id)} onChange={e => { const s = new Set(selected); e.target.checked ? s.add(row.id) : s.delete(row.id); setSelected(s); }} /></td>}
                {columns.map(col => <td key={String(col.key)} className="px-4 py-3">{col.render ? col.render(row[col.key], row) : String(row[col.key])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filtered.length} results</span>
          <div className="flex gap-2 items-center">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-2 py-1 rounded border disabled:opacity-40">←</button>
            <span>Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-2 py-1 rounded border disabled:opacity-40">→</button>
          </div>
        </div>
      )}
    </div>
  );
}
`;

    const copyCode = async () => {
        try { await navigator.clipboard.writeText(generateReactCode()); }
        catch { const t = document.createElement('textarea'); t.value = generateReactCode(); document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); }
    };

    const exportComponent = () => {
        const blob = new Blob([generateReactCode()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'DataTable.tsx';
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    };

    return (
        <div className="h-full flex overflow-hidden">
            <div className="w-96 border-r flex flex-col bg-card/30">
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Table2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black tracking-tight">Table Builder</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-60">Component Workbench</p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-6 space-y-6">
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Appearance</Label>
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label className="text-xs">Style</Label>
                                    <Select value={config.style} onValueChange={v => setConfig({ ...config, style: v as typeof config.style })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['default', 'bordered', 'striped', 'ghost'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Row Size</Label>
                                    <Select value={config.size} onValueChange={v => setConfig({ ...config, size: v as typeof config.size })}>
                                        <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['sm', 'md', 'lg'].map(s => <SelectItem key={s} value={s}>{s.toUpperCase()}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs">Rows per Page</Label>
                                    <Input type="number" min={3} max={20} value={config.rowsPerPage} onChange={e => setConfig({ ...config, rowsPerPage: parseInt(e.target.value) || 5 })} className="h-9" />
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <Label className="text-xs font-bold uppercase tracking-wider opacity-60">Features</Label>
                            {[
                                { label: 'Sortable Columns', key: 'sortable' },
                                { label: 'Row Selection', key: 'selectable' },
                                { label: 'Search Bar', key: 'showSearch' },
                                { label: 'Pagination', key: 'showPagination' },
                                { label: 'Row Actions', key: 'showActions' },
                                { label: 'Rounded Border', key: 'rounded' },
                            ].map(({ label, key }) => (
                                <div key={key} className="flex items-center justify-between">
                                    <Label className="text-sm">{label}</Label>
                                    <Switch checked={(config as Record<string, boolean>)[key]} onCheckedChange={c => setConfig({ ...config, [key]: c })} />
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollArea>

                <div className="border-t p-4 space-y-2">
                    <Button onClick={copyCode} variant="outline" className="w-full gap-2"><Copy className="w-4 h-4" />Copy React Code</Button>
                    <Button onClick={exportComponent} className="w-full gap-2"><Download className="w-4 h-4" />Export Component</Button>
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <div className="border-b px-8 py-5 bg-card/30">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Live Preview</h3>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-8 space-y-8">
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Interactive Table</h4>

                            {config.showSearch && (
                                <Input placeholder="🔍 Search..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }} className="max-w-xs h-9 text-sm" />
                            )}

                            <div style={{ border: config.style === 'bordered' ? '1px solid var(--border)' : '1px solid var(--border)', borderRadius: config.rounded ? `${tokens.radius * 0.5}rem` : 0, overflow: 'hidden' }}>
                                {config.showHeader && (
                                    <div style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                            <thead>
                                                <tr>
                                                    {config.selectable && (
                                                        <th style={{ width: 40, padding: rowPad[config.size] }}>
                                                            <input type="checkbox" checked={selected.size === pageData.length && pageData.length > 0} onChange={e => setSelected(e.target.checked ? new Set(pageData.map(r => r.id)) : new Set())} />
                                                        </th>
                                                    )}
                                                    {cols.map(col => (
                                                        <th key={col.key} onClick={() => handleSort(col.key)} style={{ padding: rowPad[config.size], textAlign: 'left', fontSize: fontSize[config.size] - 1, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)', cursor: config.sortable ? 'pointer' : 'default', userSelect: 'none', border: getBorderStyle() }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                                {col.label}
                                                                {config.sortable && (sortCol === col.key ? (sortDir === 'asc' ? <ChevronUp style={{ width: 13, height: 13 }} /> : <ChevronDown style={{ width: 13, height: 13 }} />) : <ChevronsUpDown style={{ width: 13, height: 13, opacity: 0.3 }} />)}
                                                            </div>
                                                        </th>
                                                    ))}
                                                    {config.showActions && <th style={{ padding: rowPad[config.size], textAlign: 'right', fontSize: fontSize[config.size] - 1, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted-foreground)' }}>Actions</th>}
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>
                                )}
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        {pageData.map((row, i) => (
                                            <tr key={row.id} style={{ background: getRowBg(i), borderBottom: i < pageData.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}>
                                                {config.selectable && (
                                                    <td style={{ width: 40, padding: rowPad[config.size] }}>
                                                        <input type="checkbox" checked={selected.has(row.id)} onChange={e => { const s = new Set(selected); e.target.checked ? s.add(row.id) : s.delete(row.id); setSelected(s); }} />
                                                    </td>
                                                )}
                                                {cols.map(col => (
                                                    <td key={col.key} style={{ padding: rowPad[config.size], fontSize: fontSize[config.size], border: getBorderStyle() }}>
                                                        {col.key === 'status' ? (
                                                            <span style={{ ...statusColors[row.status], fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>{row[col.key as keyof typeof row]}</span>
                                                        ) : (
                                                            <span style={{ color: col.key === 'name' ? 'var(--foreground)' : 'var(--muted-foreground)', fontWeight: col.key === 'name' ? 600 : 400 }}>{row[col.key as keyof typeof row]}</span>
                                                        )}
                                                    </td>
                                                ))}
                                                {config.showActions && (
                                                    <td style={{ padding: rowPad[config.size], textAlign: 'right' }}>
                                                        <button style={{ fontSize: 12, color: tokens.colors.primary, fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' }}>Edit</button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {config.showPagination && (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted-foreground)' }}>
                                    <span>{selected.size > 0 ? `${selected.size} selected · ` : ''}{sorted.length} total results</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}>
                                            <ArrowLeft style={{ width: 13, height: 13 }} /> Prev
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, currentPage - 2), currentPage + 1).map(p => (
                                            <button key={p} onClick={() => setCurrentPage(p)} style={{ width: 30, height: 30, borderRadius: 6, fontWeight: 700, fontSize: 12, background: p === currentPage ? tokens.colors.primary : 'transparent', color: p === currentPage ? '#fff' : 'var(--muted-foreground)', border: '1px solid var(--border)', cursor: 'pointer' }}>{p}</button>
                                        ))}
                                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1 }}>
                                            Next <ArrowRight style={{ width: 13, height: 13 }} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground opacity-60">Generated Code</h4>
                                <Button size="sm" variant="ghost" onClick={copyCode} className="gap-2"><Copy className="w-3 h-3" />Copy</Button>
                            </div>
                            <pre className="text-xs font-mono bg-muted p-6 rounded-xl overflow-x-auto max-h-96 overflow-y-auto">{generateReactCode()}</pre>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default TableBuilder;
