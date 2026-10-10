import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { isAdmin } from "@/lib/admin-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) {
    redirect("/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
