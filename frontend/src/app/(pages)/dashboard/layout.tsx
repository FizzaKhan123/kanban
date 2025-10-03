import Navbar from "../../components/Navbar";

export const metadata = {
  title: "Task Board",
  description: "Drag and drop dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
        <>
        <Navbar />
        <main className="p-4">{children}</main>
        </>
     
  );
}
