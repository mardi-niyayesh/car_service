type PlanType = {
  id?: number;
  name: string;
  description: string;
};

type SectionType = {
  title: string;
  items: string[];
  type: string;
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
    <div className="w-full">
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <span className="h-8 w-1 rounded-full bg-[#FDB713]" />

          <h2 className="text-xl font-extrabold text-gray-800 sm:text-2xl">
            {title}
          </h2>
        </div>

        <p
          className="
                    mt-3
                    text-[14px]
                    leading-7
                    text-gray-500
                   font-medium
                  "
        >
          {destitle}
        </p>
      </div>

      {state === "plans" && (
        <div className="space-y-4">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="
              group
              rounded-2xl
              border
              border-gray-100
              bg-white
              p-4
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-[#FDB713]/40
              hover:shadow-md
              sm:p-5
            "
            >
              <div className="flex items-start gap-3">
                <div
                  className="
                  mt-1
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#FDB713]/10
                  text-sm
                  font-bold
                  text-[#c58b00]
                "
                >
                  {idx + 1}
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    className="
                    inline-flex
                    rounded-lg
                    bg-[#FDB713]/10
                    px-3
                    py-1.5
                    text-sm
                    font-bold
                    text-[#b98200]
                    sm:text-base
                  "
                  >
                    {plan.name} :
                  </h3>

                  <p
                    className="
                    mt-3
                    text-[14px]
                    leading-7
                    text-gray-500
                   font-medium
                  "
                  >
                    {plan.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {state === "terms" && (
        <div className="space-y-4">
          {sections.map((section, id) => (
            <div
              key={id}
              className="
              group
              rounded-2xl
              border
              border-gray-100
              bg-white
              p-4
              shadow-sm
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-[#FDB713]/40
              hover:shadow-md
              sm:p-5
            "
            >
              <div className="flex items-start gap-3">
                <div
                  className="
                  mt-0.5
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-[#FDB713]/10
                  text-[#c58b00]
                "
                >
                  {section.type === "check" ? "✓" : "•"}
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    className="
                    inline-flex
                    rounded-lg
                    bg-[#FDB713]/10
                    px-3
                    py-1.5
                    text-sm
                    font-bold
                    text-[#b98200]
                    sm:text-base
                  "
                  >
                    {section.title}
                  </h3>

                  <div className="mt-3 space-y-2">
                    {section.items.map((item, i) => (
                      <p
                        key={i}
                        className="       mt-3
                    text-[14px]
                    leading-7
                    text-gray-500
                   font-medium"
                      >
                        <span>{item}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComponentDes;
