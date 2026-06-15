type PlanType = {
  id?: number;
  name: string;
  description: string;
};

type SectionType = {
  title: string;
  items: string[];
  type:string
};

type ComponentDesType = {
  title: string;
  destitle: string;
  state?: "plans" | "terms";
  plans?: PlanType[];
  sections?: SectionType[];
};

const ComponentDes = ({
  title,
  destitle,
  state = "plans",
  plans = [],
  sections = [],
}: ComponentDesType) => {
  return (
    <div >
      <h2 className="text-2xl font-bold text-blue-800 border-r-4 border-blue-600 pr-3 mb-4">
        {title}
      </h2>
      <p className="text-gray-600 mb-6  leading-relaxed">{destitle}</p>

      {state === "plans" && (
        <div className="space-y-6">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="bg-gray-50 rounded-xl p-4 transition hover:shadow-md"
            >
              <h3 className="bg-blue-50 text-blue-800 font-semibold inline-block px-4 py-2 rounded-lg shadow-sm">
                {plan.name} :
              </h3>
              <p className="mt-3 pr-4 text-gray-600 space-y-1 leading-relaxed">{plan.description}</p>
            </div>
          ))}
        </div>
      )}

      {state === "terms" && (
        <div className="space-y-6">
          {sections.map((section, id) => (
            <div
              key={id}
              className="bg-gray-50 rounded-xl p-4 transition hover:shadow-md"
            >
              <h3 className="bg-blue-50 text-blue-800 font-semibold inline-block px-4 py-2 rounded-lg shadow-sm">
                {section.title}
              </h3>
              <div className="mt-3 pr-4 text-gray-600 space-y-1  leading-relaxed">
                {section.items.map((item, i) => (
                  <p key={i}>
                    {section.type === "check" ? "✓" : "•"} {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComponentDes;
