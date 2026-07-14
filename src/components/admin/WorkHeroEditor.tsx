import PageHeroEditor from "./PageHeroEditor";

export default function WorkHeroEditor() {
  return (
    <PageHeroEditor
      pageName="work"
      title="Work Page — Hero Section"
      subtitle="Click to edit the top hero (badge, title, description, chip)"
      fields={[
        {
          key: "hero.subtitle",
          label: "🔖 Top Badge",
          description: "Small uppercase text above the title",
          type: "input",
          fallback: "Creative Portfolio",
        },
        {
          key: "hero.title",
          label: "💼 Hero Title",
          description: "Wrap highlighted words with | | — e.g. Our Creative |Works & Projects|",
          type: "input",
          fallback: "Our Creative |Works & Projects|",
        },
        {
          key: "hero.description",
          label: "📝 Description",
          description: "Paragraph shown below the title",
          type: "textarea",
          fallback: "A showcase of our best work across web development and graphic design.",
        },
        {
          key: "hero.badge",
          label: "🏷️ Bottom Chip",
          description: "Text after the project count (e.g. Projects • Graphic Design • Web • Video)",
          type: "input",
          fallback: "Projects • Graphic Design • Web • Video",
        },
      ]}
    />
  );
}
