import { UserHeader } from "@/components/app/user/UserHeader";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <UserHeader />
      <main className="flex-grow px-4 sm:px-6 lg:px-20">{children}</main>
    </div>
  );
}
