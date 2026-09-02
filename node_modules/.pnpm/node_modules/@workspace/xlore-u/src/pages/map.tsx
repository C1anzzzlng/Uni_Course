import { useState } from "react";
import { useListSchools } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function MapPage() {
  const { data: schools, isLoading } = useListSchools();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filteredSchools = schools?.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedSchool = schools?.find(s => s.id === selectedId) ?? filteredSchools?.[0] ?? null;

  const getEmbedUrl = (school: typeof selectedSchool) => {
    if (!school) return null;
    const q = encodeURIComponent(`${school.name}, ${school.address}, Metro Manila, Philippines`);
    return `https://maps.google.com/maps?q=${q}&output=embed`;
  };

  const getMapsLink = (school: typeof selectedSchool) => {
    if (!school) return "#";
    const q = encodeURIComponent(`${school.name}, ${school.address}, Metro Manila, Philippines`);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  };

  const embedUrl = getEmbedUrl(selectedSchool);

  return (
    <div className="flex flex-col gap-4 h-[calc(100dvh-5rem)]">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">School Map</h1>
        <p className="text-muted-foreground mt-1 text-sm">Locate institutions across Metro Manila using their full campus address</p>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
        <div className="w-full md:w-72 lg:w-80 flex flex-col gap-3 min-h-0">
          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search schools..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
              ))
            ) : filteredSchools?.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">No schools found</div>
            ) : (
              filteredSchools?.map(school => (
                <Card
                  key={school.id}
                  className={`p-3 cursor-pointer transition-all border-2 hover:border-primary/50 hover:shadow-sm ${
                    selectedSchool?.id === school.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border"
                  }`}
                  onClick={() => setSelectedId(school.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-tight text-foreground line-clamp-2">
                      {school.name}
                    </h3>
                    <Badge variant={school.type === "Public" ? "default" : "secondary"} className="text-xs shrink-0">
                      {school.type}
                    </Badge>
                  </div>
                  <div className="flex items-start text-xs text-muted-foreground mt-1.5 gap-1">
                    <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{school.address}</span>
                  </div>
                  <Link
                    href={`/schools/${school.id}`}
                    className="text-xs font-semibold text-primary hover:underline mt-2 inline-block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Profile
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-3 min-h-0">
          {selectedSchool && (
            <div className="flex items-center justify-between px-1 shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <span className="font-semibold text-sm truncate">{selectedSchool.name}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 shrink-0"
                asChild
              >
                <a href={getMapsLink(selectedSchool)} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Open in Google Maps
                </a>
              </Button>
            </div>
          )}

          <div className="flex-1 bg-card border rounded-xl overflow-hidden shadow-sm min-h-[300px]">
            {!selectedSchool && !isLoading ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <MapPin className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <p className="text-muted-foreground">Select a school to view its location</p>
              </div>
            ) : embedUrl ? (
              <iframe
                key={embedUrl}
                title={`Map of ${selectedSchool?.name}`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "300px" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={embedUrl}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
