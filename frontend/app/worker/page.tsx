import NavbarAuth from "@/components/NavbarAuth";
import NavbarAnimInit from "@/components/NavbarAnimInit";
import FooterSimple from "@/components/FooterSimple";
import WorkerDashboard from "@/components/worker/WorkerDashboard";

export const metadata = {
  title: "Worker Dashboard - HospoLink",
};

export default function WorkerPage() {
  return (
    <>
      <NavbarAuth type="worker" />
      <NavbarAnimInit />
      <WorkerDashboard />
      <FooterSimple />
    </>
  );
}
