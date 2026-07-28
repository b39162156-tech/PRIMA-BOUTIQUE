import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 grid gap-5 items-start" style={{ gridTemplateColumns: "200px 1fr" }}>
      <AdminNav />
      <div>{children}</div>
    </div>
  );
}
