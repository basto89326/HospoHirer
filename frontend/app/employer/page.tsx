import NavbarAuth from "@/components/NavbarAuth";
import NavbarAnimInit from "@/components/NavbarAnimInit";
import FooterSimple from "@/components/FooterSimple";
import EmployerDashboard from "@/components/employer/EmployerDashboard";

export const metadata = {
  title: "Employer Dashboard - HospoLink",
};

export default function EmployerPage() {
  return (
    <>
      <NavbarAuth type="employer" />
      <NavbarAnimInit />
      <EmployerDashboard />
      <FooterSimple />
    </>
  );
}
