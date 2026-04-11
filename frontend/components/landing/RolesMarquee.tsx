const rowOneRoles = [
  {
    name: "Baristas",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80",
  },
  {
    name: "Head Chefs",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80",
  },
  {
    name: "Wait Staff",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80",
  },
  {
    name: "Bartenders",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80",
  },
  {
    name: "Venue Managers",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80",
  },
  {
    name: "Sommeliers",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80",
  },
];

const rowTwoRoles = [
  {
    name: "Kitchen Hands",
    img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80",
  },
  {
    name: "Sous Chefs",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80",
  },
  {
    name: "Event Staff",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80",
  },
  {
    name: "Mixologists",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80",
  },
  {
    name: "Dishwashers",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80",
  },
  {
    name: "Hosts",
    img: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=80",
  },
];

function RoleTag({ name, img }: { name: string; img: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
      <img src={img} className="w-6 h-6 rounded-full object-cover" alt={name} />
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}

// Repeat items so one copy is always wider than the viewport
const rowOne = [...rowOneRoles, ...rowOneRoles, ...rowOneRoles, ...rowOneRoles];
const rowTwo = [...rowTwoRoles, ...rowTwoRoles, ...rowTwoRoles, ...rowTwoRoles];

export default function RolesMarquee() {
  return (
    <section id="directory" className="py-20 overflow-hidden bg-white border-y border-[#EAEAEA]">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Who&apos;s on the platform?
      </h2>

      {/* Row 1 — scrolls left */}
      <div className="relative w-full overflow-hidden mb-6">
        <div className="marquee-container animate-marquee-left gap-4">
          <div className="flex gap-4 shrink-0 px-2">
            {rowOne.map((role, i) => (
              <RoleTag key={`r1-a-${i}`} {...role} />
            ))}
          </div>
          <div className="flex gap-4 shrink-0 px-2" aria-hidden="true">
            {rowOne.map((role, i) => (
              <RoleTag key={`r1-b-${i}`} {...role} />
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative w-full overflow-hidden">
        <div className="marquee-container animate-marquee-right gap-4">
          <div className="flex gap-4 shrink-0 px-2">
            {rowTwo.map((role, i) => (
              <RoleTag key={`r2-a-${i}`} {...role} />
            ))}
          </div>
          <div className="flex gap-4 shrink-0 px-2" aria-hidden="true">
            {rowTwo.map((role, i) => (
              <RoleTag key={`r2-b-${i}`} {...role} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
