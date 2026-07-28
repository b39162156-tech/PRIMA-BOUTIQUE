"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { storageUrl } from "@/lib/utils";
import type { Slide } from "@/lib/types";

export default function AdminSliderPage() {
  const supabase = createClient();
  const [slides, setSlides] = useState<Slide[]>([]);
  const [duration, setDuration] = useState(3700);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function load() {
    const { data } = await supabase.from("slides").select("*").order("sort_order");
    setSlides(data || []);
    const { data: setting } = await supabase.from("site_settings").select("value").eq("key", "slider_duration_ms").single();
    if (setting) setDuration(Number(setting.value));
  }

  useEffect(() => {
    load();
  }, []);

  async function saveDuration(value: number) {
    setDuration(value);
    await supabase.from("site_settings").update({ value }).eq("key", "slider_duration_ms");
  }

  async function addSlide(file: File) {
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("slider-images").upload(path, file, { upsert: true });
    if (error) {
      alert("Erreur lors de l'import : " + error.message);
      return;
    }
    await supabase.from("slides").insert({
      title: "Nouvelle bannière",
      subtitle: "Modifiez ce texte",
      storage_path: path,
      sort_order: slides.length,
      is_active: true,
    });
    load();
  }

  async function removeSlide(id: string) {
    await supabase.from("slides").delete().eq("id", id);
    load();
  }

  async function updateText(id: string, field: "title" | "subtitle", value: string) {
    setSlides((s) => s.map((x) => (x.id === id ? { ...x, [field]: value } : x)));
    await supabase.from("slides").update({ [field]: value }).eq("id", id);
  }

  async function move(id: string, dir: -1 | 1) {
    const i = slides.findIndex((s) => s.id === id);
    const j = i + dir;
    if (j < 0 || j >= slides.length) return;
    const copy = [...slides];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setSlides(copy);
    await Promise.all(copy.map((s, idx) => supabase.from("slides").update({ sort_order: idx }).eq("id", s.id)));
  }

  return (
    <div>
      <h1 className="font-display text-xl mb-4">Slider publicitaire</h1>

      <div className="bg-white rounded-2xl p-4.5 p-4 mb-4 flex items-center gap-3.5 flex-wrap">
        <label className="text-sm text-gray-600">Durée du défilement (ms)</label>
        <input
          type="number"
          value={duration}
          step={100}
          onChange={(e) => saveDuration(Number(e.target.value))}
          className="border border-gray-200 rounded-lg px-2.5 py-2 text-sm w-28"
        />
        <button
          onClick={() => fileRef.current?.click()}
          className="ml-auto bg-pink text-white rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2"
        >
          <Upload size={14} /> Importer une image
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && addSlide(e.target.files[0])}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        {slides.map((s, idx) => {
          const url = storageUrl("slider-images", s.storage_path);
          return (
            <div key={s.id} className="bg-white rounded-2xl p-3.5 flex items-center gap-3.5">
              <div
                className="w-24 h-14 rounded-lg bg-graylight shrink-0 bg-cover bg-center"
                style={{ backgroundImage: url ? `url(${url})` : undefined }}
              />
              <div className="flex-1 flex flex-col gap-1.5">
                <input
                  value={s.title}
                  onChange={(e) => updateText(s.id, "title", e.target.value)}
                  className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm"
                />
                <input
                  value={s.subtitle || ""}
                  onChange={(e) => updateText(s.id, "subtitle", e.target.value)}
                  className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => move(s.id, -1)} disabled={idx === 0} className="w-7 h-7 rounded-lg border border-gray-200 bg-graylight">↑</button>
                <button onClick={() => move(s.id, 1)} disabled={idx === slides.length - 1} className="w-7 h-7 rounded-lg border border-gray-200 bg-graylight">↓</button>
              </div>
              <button onClick={() => removeSlide(s.id)} className="text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
