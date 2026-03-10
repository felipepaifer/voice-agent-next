import { AdminDashboard } from "@/composedComponents/AdminDashboard";
import ContextWrapper from "@/contexts/ContextWrapper";

export default function Home() {
  return (
    <ContextWrapper>
      <AdminDashboard />
    </ContextWrapper>
  );
}
