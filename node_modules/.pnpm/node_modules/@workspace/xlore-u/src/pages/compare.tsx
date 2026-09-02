import { useMemo, useState } from "react";
import { useListSchools, useListPrograms } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Check, Minus, Search, Building2, BookOpen } from "lucide-react";
import type { School, Program } from "@workspace/api-client-react";
import type { ReactNode } from "react";

export default function ComparePage() {
  const { data: schools, isLoading: schoolsLoading } = useListSchools();
  const { data: programs, isLoading: programsLoading } = useListPrograms();
  const [selectedSchoolIds, setSelectedSchoolIds] = useState<number[]>([]);
  const [selectedProgramIds, setSelectedProgramIds] = useState<number[]>([]);
  const [schoolSearch, setSchoolSearch] = useState("");
  const [programSearch, setProgramSearch] = useState("");

  const toggle = (id: number, selected: number[], setSelected: (next: number[]) => void) => {
    if (selected.includes(id)) setSelected(selected.filter(x => x !== id));
    else if (selected.length < 3) setSelected([...selected, id]);
  };
  const selectedSchools = selectedSchoolIds.map(id => schools?.find(s => s.id === id)).filter(Boolean) as School[];
  const selectedPrograms = selectedProgramIds.map(id => programs?.find(p => p.id === id)).filter(Boolean) as Program[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compare</h1>
        <p className="text-muted-foreground mt-2">Compare institutions with one another, or compare programs across institutions.</p>
      </div>
      <Tabs defaultValue="schools">
        <TabsList>
          <TabsTrigger value="schools">Institutions</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
        </TabsList>
        <TabsContent value="schools" className="space-y-6 mt-6">
          <Picker
            label="Add institution"
            placeholder={selectedSchools.length >= 3 ? "Maximum of 3 selected" : "Select an institution…"}
            disabled={schoolsLoading || selectedSchools.length >= 3}
             items={schools?.filter(s => !selectedSchoolIds.includes(s.id)).map(s => ({ id: s.id, label: s.name, description: s.address })) || []}
            selected={selectedSchools.map(s => ({ id: s.id, label: s.name }))}
             search={schoolSearch}
             onSearch={setSchoolSearch}
            onAdd={id => toggle(id, selectedSchoolIds, setSelectedSchoolIds)}
            onRemove={id => setSelectedSchoolIds(selectedSchoolIds.filter(x => x !== id))}
          />
          {selectedSchools.length ? (
            <div className="rounded-xl border overflow-hidden bg-card shadow-sm overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead className="w-[190px]">Feature</TableHead>{selectedSchools.map(s => <TableHead key={s.id} className="min-w-[230px] align-top"><div className="font-bold text-primary">{s.name}</div><div className="text-xs font-normal text-muted-foreground mt-1">{s.address}</div></TableHead>)}</TableRow></TableHeader>
                <TableBody>
                  <CompareRow label="Type" values={selectedSchools.map(s => <Badge variant={s.type === "Public" ? "default" : "outline"}>{s.type}</Badge>)} />
                  <CompareRow label="Tuition" values={selectedSchools.map(s => s.tuitionMax === 0 ? "Free" : `₱${s.tuitionMin.toLocaleString()} – ₱${s.tuitionMax.toLocaleString()}`)} />
                  <CompareRow label="Programs listed" values={selectedSchools.map(s => programs?.filter(p => p.schoolId === s.id).length ?? "—")} />
                  <TableRow className="bg-muted/10"><TableCell colSpan={selectedSchools.length + 1} className="font-bold">Senior high strands</TableCell></TableRow>
                  {["ABM", "HUMSS", "STEM", "ICT", "GAS", "TVL"].map(strand => <CompareRow key={strand} label={strand} values={selectedSchools.map(s => s.strands.includes(strand) ? <span className="text-emerald-600 flex items-center gap-1"><Check className="h-4 w-4" /> Offered</span> : <span className="text-muted-foreground flex items-center gap-1"><Minus className="h-4 w-4" /> Not listed</span>)} />)}
                </TableBody>
              </Table>
            </div>
          ) : <EmptyCompare text="Select up to three institutions to compare." />}
        </TabsContent>
        <TabsContent value="programs" className="space-y-6 mt-6">
          <Picker
            label="Add program"
            placeholder={selectedPrograms.length >= 3 ? "Maximum of 3 selected" : "Select a program…"}
            disabled={programsLoading || selectedPrograms.length >= 3}
             items={programs?.filter(p => !selectedProgramIds.includes(p.id)).map(p => ({ id: p.id, label: `${p.name} — ${p.schoolName}`, description: p.description })) || []}
            selected={selectedPrograms.map(p => ({ id: p.id, label: p.name }))}
             search={programSearch}
             onSearch={setProgramSearch}
            onAdd={id => toggle(id, selectedProgramIds, setSelectedProgramIds)}
            onRemove={id => setSelectedProgramIds(selectedProgramIds.filter(x => x !== id))}
          />
          {selectedPrograms.length ? (
            <div className="rounded-xl border overflow-hidden bg-card shadow-sm overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead className="w-[190px]">Feature</TableHead>{selectedPrograms.map(p => <TableHead key={p.id} className="min-w-[230px] align-top"><div className="font-bold text-primary">{p.name}</div><div className="text-xs font-normal text-muted-foreground mt-1">{p.schoolName}</div></TableHead>)}</TableRow></TableHeader>
                <TableBody>
                  <CompareRow label="Institution" values={selectedPrograms.map(p => p.schoolName)} />
                  <CompareRow label="Category" values={selectedPrograms.map(p => <Badge variant="outline">{p.category}</Badge>)} />
                  <CompareRow label="Senior high strand" values={selectedPrograms.map(p => p.strand)} />
                  <CompareRow label="Career paths" values={selectedPrograms.map(p => p.careerPaths.length ? p.careerPaths.join(", ") : "Not listed")} />
                  <CompareRow label="Requirements" values={selectedPrograms.map(p => p.requirements.length ? p.requirements.join(", ") : "Not listed")} />
                </TableBody>
              </Table>
            </div>
          ) : <EmptyCompare text="Select up to three programs to compare across institutions." />}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Picker({ label, placeholder, disabled, items, selected, search, onSearch, onAdd, onRemove }: { label: string; placeholder: string; disabled: boolean; items: { id: number; label: string; description?: string }[]; selected: { id: number; label: string }[]; search: string; onSearch: (value: string) => void; onAdd: (id: number) => void; onRemove: (id: number) => void }) {
  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items.slice(0, 8);
    return items.filter(item => `${item.label} ${item.description || ""}`.toLowerCase().includes(term)).slice(0, 8);
  }, [items, search]);

  return <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
    <h3 className="font-semibold text-lg">{label}</h3>
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
      <Input value={search} onChange={e => onSearch(e.target.value)} disabled={disabled} placeholder={placeholder === "Select an institution…" ? "Search institutions by name or address…" : "Search programs by name, school, or description…"} className="pl-9" />
    </div>
    {!disabled && filteredItems.length > 0 && (
      <div className="grid gap-2 max-h-64 overflow-y-auto rounded-lg border bg-background p-2">
        {filteredItems.map(item => <button type="button" key={item.id} onClick={() => onAdd(item.id)} className="flex items-start gap-3 rounded-md p-3 text-left hover:bg-accent transition-colors">
          {label.toLowerCase().includes("institution") ? <Building2 className="h-4 w-4 mt-0.5 text-primary shrink-0" /> : <BookOpen className="h-4 w-4 mt-0.5 text-primary shrink-0" />}
          <span className="min-w-0"><span className="block text-sm font-medium">{item.label}</span>{item.description && <span className="block text-xs text-muted-foreground truncate">{item.description}</span>}</span>
        </button>)}
      </div>
    )}
    <div className="flex flex-wrap gap-2 items-center">
      {selected.map(item => <Badge key={item.id} variant="secondary" className="px-3 py-1.5 flex items-center gap-2"><span className="max-w-[220px] truncate">{item.label}</span><Button type="button" variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => onRemove(item.id)}><X className="h-3 w-3" /></Button></Badge>)}
      {disabled && <span className="text-xs text-muted-foreground">Maximum of three selected.</span>}
    </div>
  </div>;
}

function CompareRow({ label, values }: { label: string; values: ReactNode[] }) {
  return <TableRow><TableCell className="font-medium text-muted-foreground">{label}</TableCell>{values.map((value, index) => <TableCell key={index}>{value}</TableCell>)}</TableRow>;
}

function EmptyCompare({ text }: { text: string }) {
  return <div className="text-center py-20 bg-card rounded-xl border border-dashed text-muted-foreground">{text}</div>;
}