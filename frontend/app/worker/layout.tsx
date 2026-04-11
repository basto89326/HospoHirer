import NavbarAuth from "@/components/NavbarAuth";
import NavbarAnimInit from "@/components/NavbarAnimInit";
import FooterSimple from "@/components/FooterSimple";

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarAuth type="worker" />
      <NavbarAnimInit />
      {children}
      <FooterSimple />
    </>
  );
}
