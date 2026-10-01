# Tabs Design System

An accessible, reusable **Tabs** component with an optional **Badge**, built as a slice of a
design system: semantic tokens, framework-agnostic CSS, and the WAI-ARIA APG Tabs pattern
implemented from scratch.

## Context

Take-home exercise: a Tabs component with Badge support, designed as part of a design system,
built from a provided Figma file and base repository. No CSS frameworks and no UI or headless
libraries: the React logic and the SCSS are raw implementations.

## Acceptance criteria

| User story | Where |
| --- | --- |
| Switch between the Tabs variants | `variant="pill" \| "underline"` on `Tabs` — stories `Pill`, `Underline` |
| Add a Badge to a Tab through its API | `badge={{ label }}` on `Tab` — story `WithBadge` |
| Choose the Badge variant through the Tab API | `badge={{ label, variant }}` — story `WithBadge` |

## Quick start

Requires **Node >= 24** and **pnpm** (the repo pins `pnpm@11.18.0` via `packageManager`).

```bash
pnpm install
pnpm dev          # Vite dev app (src/index.tsx)
pnpm storybook    # Storybook on :6006 — the main way to review the component
pnpm test         # Vitest: unit, behaviour and axe tests
pnpm check        # Biome lint + format
pnpm tsc          # TypeScript, including the type-level tests
```

## Usage

```tsx
import { Tab, TabList, TabPanel, Tabs } from "./components";

<Tabs defaultValue="emails" variant="pill">
  <TabList aria-label="Inbox sections">
    <Tab value="emails">Emails</Tab>
    <Tab value="drafts" badge={{ label: "3" }}>
      Drafts
    </Tab>
    <Tab value="files" badge={{ label: "Warning", variant: "negative" }}>
      Files
    </Tab>
  </TabList>
  <TabPanel value="emails">Emails panel</TabPanel>
  <TabPanel value="drafts">Drafts panel</TabPanel>
  <TabPanel value="files">Files panel</TabPanel>
</Tabs>
```

Controlled mode replaces `defaultValue` with `value` + `onValueChange`. `variant` is
`"pill" | "underline"`; the badge variant is `"neutral" | "positive" | "negative"`.

## Where to look first

| File | What it holds |
| --- | --- |
| `src/components/Tabs/Tabs.tsx` | The controlled/uncontrolled state, the props union, and the context provider. |
| `src/components/Tabs/Tab.tsx` | The single tab: ARIA wiring, badge rendering, composed `onClick`. |
| `src/components/Tabs/useRovingFocus.ts` | Keyboard navigation and roving tabindex, reading the tab order from the DOM. |
| `src/components/Tabs/Tabs.scss` | The two variants, the states, the mobile media query. |
| `src/tokens/index.scss` | The tokens exposed as CSS custom properties. |
| `src/components/index.ts` | The public API of the library (`src/index.tsx` is only the demo app entry). |

## Design decisions

### API

- **Compound components** (`Tabs`, `TabList`, `Tab`, `TabPanel`) sharing state through context,
  instead of a data-driven `items` array: more flexible for consumers and the standard shape in
  design systems.
- **Controlled or uncontrolled**, enforced by a **props union**: either `value` + `onValueChange`
  or `defaultValue`. "No tab selected" is impossible at compile time, and `onValueChange` is
  required in controlled mode.
- Tabs are identified by a **string `value`**, not by index: stable if tabs are reordered or
  filtered.
- **`variant` lives on `Tabs`** and travels through context, so mixing pill and underline inside
  one group is not possible.
- **Badge through the Tab API**: `badge={{ label, variant }}`. This mirrors Figma, where a tab has
  a boolean that reveals a nested Badge instance with its own Variant and Label, and it keeps the
  badge constrained to the design instead of offering a free slot.
- `onValueChange` fires **only on an actual change**: clicking the already selected tab does not
  notify.
- **Consumer handlers are composed, not overridden**: `onClick` on `Tab` and `onKeyDown` on
  `TabList` run first, and calling `event.preventDefault()` there cancels the selection or the
  keyboard navigation.
- **`className` is closed** on every component: styling stays owned by the design system.
- `TabList` **requires** `aria-label` or `aria-labelledby`, again through a props union:
  accessibility enforced by the type system.

### Accessibility

- Follows the **WAI-ARIA APG Tabs pattern**: `role="tablist"` / `"tab"` / `"tabpanel"`,
  `aria-selected`, `aria-controls` and `aria-labelledby`, roving tabindex, and the panel as a tab
  stop so `Tab` moves focus from the tablist into the content.
- **Keyboard**: `ArrowLeft` / `ArrowRight` with wrap-around, `Home`, `End`. Activation is
  **automatic** — moving focus selects the tab.
- The tab order is read from the **DOM** (`[role="tab"]` inside the tablist), so there is no
  registration system to keep in sync with rendering.
- Inactive panels are rendered with `hidden`, **never unmounted**, so `aria-controls` always
  resolves to a real element.
- The selected state is styled from **`[aria-selected="true"]`**, not from a modifier class: the
  visual state and the accessible state cannot diverge.
- The badge is separated from the label by a **real space**, so the accessible name is
  `"Files Warning"` and not `"FilesWarning"`.
- Generated ids come from one `useId` plus the tab `value`, with whitespace replaced, because
  `aria-controls` and `aria-labelledby` are space-separated id lists.
- The focused tab is **scrolled into view**, which matters when the tablist scrolls horizontally.
- The **panel focus ring is drawn inside** the panel (`outline-offset: -2px`), unlike the one on a
  tab: an outward ring could overlap the tabs above it whatever layout the consumer puts around
  the component.
- Information is never carried by colour alone, and the selected state survives
  `forced-colors: active`.
- There are **no transitions and no animations**, so there is nothing for
  `prefers-reduced-motion` to reduce.

### Styling and tokens

- Plain **SCSS with BEM classes under a `ds-` prefix** (`ds-tab`, `ds-tab--pill`,
  `ds-tab__label`) — no CSS Modules and no CSS-in-JS, so the stylesheet is not tied to React.
- Token names are **semantic and aligned with Figma** (`SurfaceHigh` → `--ds-color-surface-high`).
  Colours and every spacing that belongs to the scale come from tokens.
- The same hex with two different meanings gets **two literal tokens**
  (`surface-high` / `surface-active`, `on-neutral` / `inverse`); an intentional link is an
  **alias** (`--ds-color-focus-ring: var(--ds-color-inverse)`).
- **Figma has no token for a few values, so those stay as raw px in the component SCSS**, each one
  declared and commented where it appears: the radii, the fixed tab heights (50px, 42px on
  mobile), the 3px underline, the 4px of padding the mobile tablist needs for the focus ring, and
  the focus ring itself (2px outline, 2px offset). In a real system I would add radius tokens and
  a focus-ring token group; the heights and the line would still be component constants.
- `:hover` rules live inside `@media (hover: hover)`, so a tap on a touch device does not leave a
  tab stuck in its hover state.
- Nothing has a fixed width where Figma says "Hug": size comes from padding, font size and line
  height.
- The button reset includes `padding: 0`, because the pill only sets `padding-inline` and the
  native vertical padding of `<button>` was eating space inside the fixed height.

### Mobile

- **Mobile is a media query (≤ 768px), not a prop** as in Figma: consumers should not have to
  manage breakpoints. Trade-off: the Storybook Docs page cannot show desktop and mobile side by
  side, so dedicated `Mobile` stories use the viewport instead.
- **Focus ring trade-off.** On mobile the tablist is a scroll container, which clips anything
  outside its box — including the 4px focus ring (2px outline + 2px offset). The list gets 4px of
  padding: cancelled by a negative margin vertically, so the tabs stay where Figma puts them, but
  kept as real space horizontally, because a negative inline margin could push the list past its
  container and scroll the whole page. **The result is that on mobile the first tab starts 4px
  further from the container edge than in Figma**, in exchange for a complete focus ring on the
  first and last tab and no page overflow.

## Figma inconsistencies and assumptions

| # | What Figma shows | How it was resolved |
| --- | --- | --- |
| 1 | Pill selected default has padding top/bottom 4XS, every other state 0. | Implemented as 0. The height is fixed, so there is no visual difference. |
| 2 | The focus ring is raw `#000000` on pill and Inverse on underline. | Normalised on one token, Inverse. |
| 3 | Badge and pill radii are raw px, while the underline focus ring radius uses a spacing token (2XS). | Kept as drawn; there are no dedicated radius tokens to normalise against. |
| 4 | Pill unselected uses Outline on active and OutlineHover on hover. | Implemented as in Figma. |
| 5 | In the "Tab with Badge" examples the tab is `Mobile: true` but the nested badge is `Mobile: false`. | Both follow the same media query in code. |

Two assumptions could not be verified in Figma:

- On a selected underline tab with a badge, the line spans the full content width
  (label + badge).
- The focus ring on mobile behaves the same as on desktop.

## Testing strategy

- **Unit and behaviour tests** (Vitest + Testing Library + user-event), next to each component.
  They query by role and accessible name and drive the component the way a user would, so they
  describe behaviour rather than implementation.
- **Accessibility tests**: every component has a `vitest-axe` test. axe in jsdom cannot evaluate
  colour contrast, so contrast is checked in Storybook through the a11y addon, which runs on
  every story.
- **Type-level tests**: `src/components/Tabs/Tabs.types.test-d.tsx` pins the props unions
  described above, and is checked by `pnpm tsc`.
- **Manual verification**: keyboard navigation (arrows with wrap, Home, End, tabbing into the
  panel, focus scrolled into view on a scrolling tablist) and Windows High Contrast emulation via
  `forced-colors: active`.
- **Screen reader**: verified with VoiceOver on macOS (Chrome, Italian locale). Each tab is announced with its
  name, role, selected state and position (e.g. "Files Warning, selected, tab, 2 of 5"), the
  badge text is part of the tab name, and the panel is announced with the name of its tab.

## Out of scope and next steps

- The Figma `Icon` and `Timer` tab properties: not part of the acceptance criteria.
- **Disabled state**: not in the design, so the `disabled` prop is closed. Adding it would mean
  `aria-disabled` rather than `disabled` (the tab stays focusable and announced), skipping
  disabled tabs in `useRovingFocus`, and ignoring them when selecting.
- **Manual activation** (`Enter` / `Space` to select, arrows only to move focus): automatic
  activation only for now.
- **RTL**: the arrow keys are not mirrored.
- **Id collisions**: `"my files"` and `"my-files"` produce the same id. Accepted, since values
  that near-identical would already be a bug on the consumer side.
- **A full states matrix in Storybook**: showing `:hover` and `:active` side by side means forcing
  pseudo-classes, which needs an addon, and adding a dependency was out of scope. Those states are
  reachable by interacting with the existing stories.
- **Generated props tables for the unions**: `react-docgen` does not extract props out of a union
  type, so `value` / `defaultValue` / `onValueChange` on `Tabs` and `aria-label` /
  `aria-labelledby` on `TabList` are documented with hand-written tables in `Tabs.mdx`. They have
  to be kept in sync with the types by hand.
- **Visual regression tests**: not included; the next step would be the Storybook test-runner or
  Playwright screenshots.

## AI usage

Built with Claude Code as a pair programmer. I set the architecture, the API and the accessibility decisions, reviewed every change, and verified the result manually against the Figma file. Every decision documented here is one I can walk through and extend.
