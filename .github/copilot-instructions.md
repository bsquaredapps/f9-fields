# Copilot Instructions — f9-fields

## What this repo is

A suite of **Power Apps Component Framework (PCF) virtual (React-based) code components** for use in **Canvas Apps**. Each control wraps a [Fluent UI v9](https://react.fluentui.dev/) React component, exposing it through the PCF interface so Canvas App makers can use it like a native control.

Controls: `Field`, `InputField`, `CheckboxField`, `ChoiceGroupField`, `ComboboxField`, `TextareaField`, `FilePickerField`, `Scroller`, `Dialog`. `ControlTemplate` is a blank starter.

All controls use the **platform-supplied React 16 and Fluent UI 9 libraries** declared in the manifest (not bundled):
```xml
<platform-library name="React" version="16.8.6" />
<platform-library name="Fluent" version="9.5.2" />
```
This means `react`, `react-dom`, and `@fluentui/react-components` must be listed as `devDependencies` only (or `peerDependencies`) — they are provided at runtime by the platform and **must not be bundled** into the control output.

Code should follow **Microsoft PCF best practices**: no external service calls unless declared in the manifest, no bundled copies of platform libraries, proper `destroy()` cleanup, and use of `context.mode.trackContainerResize(true)` for size-aware controls.

---

## Build, lint, and dev commands

Each control is an independent project. Run commands **from inside the control's folder** (e.g., `cd InputField`):

```sh
npm run build          # production build
npm run rebuild        # clean + build
npm run start          # local test harness (pcf-start)
npm run start:watch    # local test harness with file watch
npm run lint           # ESLint
npm run lint:fix       # ESLint with auto-fix
npm run refreshTypes   # regenerate ManifestTypes from ControlManifest.Input.xml
```

There are no automated tests. The root `package.json` scripts apply to the root workspace only.

The **Solution** folder (`Solution/Solution.cdsproj`) packages all controls into a Dataverse solution — build it separately with the Power Platform CLI (`pac solution build`).

---

## Architecture

### Per-control structure

Every control follows this layout (example: `InputField/`):

```
InputField/
  InputField.pcfproj          # MSBuild project (references namespace/constructor)
  package.json                # npm scripts, deps (pcf-scripts, fluent, react 16)
  pcfconfig.json              # pcf-scripts config
  tsconfig.json               # TypeScript config
  InputField/
    ControlManifest.Input.xml # Declares all properties, events, resources
    index.ts                  # PCF class (init / updateView / getOutputs / destroy)
    F9InputField.tsx          # React component tree root
    generated/
      ManifestTypes.d.ts      # Auto-generated from manifest — do NOT edit manually
    strings/
      *.resx                  # Localization resource files
```

### Shared code (`Utilities/` and `components/`)

- **`Utilities/`** — shared TypeScript utilities imported by controls via relative paths (`../../Utilities/...`):
  - `PAEvent.ts` — `PAEventQueue` class and event schema/types for the Power Apps event system
  - `useScrollSize.tsx` — custom hook measuring scroll/content size via `ResizeObserver` + `MutationObserver`
  - `useResizeObserver.tsx`, `useMutationObserver.tsx` — low-level observer hooks
  - `useDefaultState.ts`, `useDeepEqualMemo.ts`, `useTimeout.ts` — general utility hooks
  - `ValidationSchema.ts`, `parseJSONSafe.ts`, `simpleOption.ts`, `arrayDifference.ts` — data helpers

- **`components/`** — vendored/adapted Fluent UI compose utilities (slots, `resolveShorthand`, `getSlots`, types). Treat as stable internal infrastructure.

### PCF lifecycle + event pattern

Every control class in `index.ts` follows this pattern:

1. **`init()`** — store `notifyOutputChanged`, initialize private state from `context.parameters`, call `context.mode.trackContainerResize(true)`, bind all handlers.
2. **`updateView()`** — call `this.eventQueue.execute(context)` first, then destructure `context.parameters`/`context.mode`, rebuild React props, return `React.createElement(F9XxxField, props)`.
3. **`getOutputs()`** — return all bound/output properties including `Events: this.eventQueue.getOutput()`.
4. **`getOutputSchema()`** — async, returns `{ Events: PAEventsSchema }`.

### JSON-over-text instead of datasets

These controls deliberately avoid PCF `<data-set>` properties. Canvas Apps have a known issue where dataset-typed properties do not reliably update (or trigger `updateView`) when set to `null` or cleared. Instead, **all list/collection inputs are plain text properties** (`of-type="Multiple"` or `of-type="SingleLine.Text"`) containing JSON-serialized arrays.

The canonical option shape (used by `ComboboxField`, `ChoiceGroupField`, etc.):
```ts
type F9SimpleOption<T> = {
    Value: string;   // required, always coerced to string
    Text?: string;
    Group?: string;
    Persona?: PersonaProps;
    Props?: T;
    IsCustom?: boolean;
}
```

Use `parseOptions(json)` from `Utilities/simpleOption.ts` to safely parse these inputs — it handles `null`, invalid JSON, single-object inputs, and coerces `Value` to string. Use `parseJSONSafe(json)` from `Utilities/parseJSONSafe.ts` for any other JSON text property.

When adding new list-type inputs to a control, **use a text property with `parseOptions`/`parseJSONSafe`** rather than a `<data-set>` element.

### Power Apps event queue (`PAEventQueue`)

Events are queued in handlers (e.g., `onChange`, `onResize`) via `this.eventQueue.add(event, "OnValueChange")`, then `notifyOutputChanged()` is called. On the next `updateView()`, `execute(context)` reconciles queued events against `context.parameters.Events.raw` (confirmed by Power Apps), then fires the named control events from `context.events`.

All event outputs use the `Events` output property (type `Object`, schema `PAEventsSchema`). The manifest must declare a hidden `EventsSchema` input property and a `<property-dependency>` linking it to `Events`.

### Debounce pattern

Controls with text/value input (`InputField`, `TextareaField`, etc.) support a `DelayOutput` enum property (`none` | `debounce` | `onblur`) and `DelayTimeout` (ms). This gates when `notifyOutputChanged()` is called, using `window.setTimeout`.

### Sizing pattern

Controls track four size properties:
- `ContentHeight`/`ContentWidth` — full component bounding box (from `useScrollSize`)
- `ControlHeight`/`ControlWidth` — the inner input element size (queried via DOM selector like `span.fui-Input`)
- `LabelWidth` — measured from `.fui-Field__label` DOM element

Each has an `Auto*` boolean input; when `false`, the control uses the explicit `*Width`/`*Height` bound property instead of measuring.

### HTML content rendering

`hint`, `info`, `validationMessage`, and `label` props may contain HTML strings. They are sanitized with **DOMPurify/isomorphic-dompurify** before rendering via `dangerouslySetInnerHTML`. The `renderSlotAsHtml` helper in `Field/Field/F9Field.tsx` handles this pattern.

### Manifest conventions

- All controls use `control-type="virtual"` (React-based PCF).
- Platform libraries declared: `React 16.8.6`, `Fluent 9.5.2`.
- Common shared properties across all field controls: `Label`, `Hint`, `Info`, `Required`, `ValidationMessage`, `ValidationState` (enum: none/success/warning/error), `Orientation` (horizontal/vertical), `Size` (small/medium/large).
- Output-only sizing props: `ContentHeight`, `ContentWidth`.
- Events output: hidden `EventsSchema` input + `Events` output + `<property-dependency>`.

### Canvas App PCF gotchas

- **`updateView` is the only update path.** There is no component lifecycle equivalent to `componentDidUpdate` outside of it. All state that needs to survive re-renders must be stored as private class fields on the PCF class, not in React state (React state is reset when the component unmounts/remounts).
- **`context.parameters.Foo.raw` can be `null`.** Always null-coalesce or guard before use. Manifest `default-value` does not guarantee a non-null `.raw` at runtime.
- **`updatedProperties` array** in `updateView` lists which parameter names changed. Use it to avoid resetting state on every render — especially for `ControlHeight`/`ControlWidth`/`LabelWidth` when the corresponding `Auto*` flag is false.
- **`context.mode.isRead`** is a non-standard extension (typed via the local `CustomContext` interface). Check it to render read-only state without disabling the control.
- **`context.events`** is also non-standard — it contains the named event callbacks declared in the manifest that the framework executes when signaled. Always typed via the local `CustomContext` interface.
- **Do not use `ReactDOM.render`** — PCF virtual controls return a `ReactElement` from `updateView`; the platform mounts it. Never call `ReactDOM.render` or `ReactDOM.createRoot` in a virtual control.
- **Version the manifest** (`version` attribute on `<control>`) when publishing updates to an existing solution. The platform uses this to detect changes.

### TypeScript / ESLint config

- TypeScript target: ES2018, React 16 JSX, strict mode. `ManifestTypes.d.ts` is auto-generated — run `npm run refreshTypes` after manifest changes.
- ESLint: extends `eslint:recommended` + `plugin:react/recommended`, uses `@typescript-eslint/parser`, includes `@microsoft/power-apps` plugin. `no-unused-vars` is turned off (TypeScript handles it).
- React is imported as `* as React` (not default import) throughout.
