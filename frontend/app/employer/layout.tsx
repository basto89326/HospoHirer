import NavbarAuth from "@/components/NavbarAuth";
import NavbarAnimInit from "@/components/NavbarAnimInit";
import FooterSimple from "@/components/FooterSimple";

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarAuth type="employer" />
      <NavbarAnimInit />
      {children}
      <FooterSimple />
    </>
  );
}
