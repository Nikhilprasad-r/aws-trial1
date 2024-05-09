"use client";
import AdminPanel from "@/components/AdminPanel";
import RegisterUser from "@/components/RegisterUser";
import SidePanel from "@/components/SidePanel";
import { UserProvider } from "@/context/UserContext";
export default function Home() {
  return (
    <UserProvider>
      <SidePanel />
      <AdminPanel />
    </UserProvider>
  );
}
