
      {/* Basic Button */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Basic</h2>
        <Button>Default Button</Button>
      </section>

      {/* Variants */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Variants</h2>
        <div className="flex gap-3 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </section>

      {/* Sizes */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Sizes</h2>
        <div className="flex gap-3 flex-wrap">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Add">
            <Plus className="size-5" />
          </Button>
        </div>
      </section>

      {/* Icons + Loading + Full Width */}
      <section>
        <h2 className="text-lg font-semibold mb-2">With Icons & Loading</h2>
        <div className="flex gap-3 flex-wrap">
          <Button leftIcon={<Plus className="size-4" />}>Add Item</Button>
          <Button rightIcon={<Check className="size-4" />}>Save</Button>
          <Button variant="destructive" leftIcon={<Trash2 className="size-4" />}>
            Delete
          </Button>
          <Button loading>Loading…</Button>
          <Button fullWidth>Full Width Button</Button>
        </div>
      </section>

      {/* Inside a form */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Inside Form</h2>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Form submitted!");
          }}
        >
          <input
            type="text"
            placeholder="Your name"
            className="border rounded px-3 py-2 w-full"
          />
          <Button type="submit">Submit</Button>
        </form>
      </section>


