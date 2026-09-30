import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Tab } from "./Tab";
import { TabList } from "./TabList";
import { TabPanel } from "./TabPanel";
import { Tabs } from "./Tabs";

// Not global in .storybook/preview: that would hide a component missing its own font.
const withTokenFont: Decorator = (Story) => (
  <div style={{ fontFamily: "var(--ds-font-family)" }}>
    <Story />
  </div>
);

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  subcomponents: { TabList, Tab, TabPanel },
  // No autodocs tag: Tabs.mdx is the docs page for this component.
  decorators: [withTokenFont],
  args: { variant: "pill", defaultValue: "emails" },
  argTypes: {
    variant: { control: "inline-radio", options: ["pill", "underline"] },
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Inbox sections">
        <Tab value="emails">Emails</Tab>
        <Tab value="files">Files</Tab>
        <Tab value="archive">Archive</Tab>
      </TabList>
      <TabPanel value="emails">Emails panel</TabPanel>
      <TabPanel value="files">Files panel</TabPanel>
      <TabPanel value="archive">Archive panel</TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Pill: Story = {};

export const Underline: Story = { args: { variant: "underline" } };

/** A badge is added through the Tab API and shows up in the accessible name. */
export const WithBadge: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Inbox sections">
        <Tab value="emails">Emails</Tab>
        <Tab value="drafts" badge={{ label: "3" }}>
          Drafts
        </Tab>
        <Tab value="sent" badge={{ label: "Sent", variant: "positive" }}>
          Sent
        </Tab>
        <Tab value="files" badge={{ label: "Warning", variant: "negative" }}>
          Files
        </Tab>
      </TabList>
      <TabPanel value="emails">Emails panel</TabPanel>
      <TabPanel value="drafts">Drafts panel</TabPanel>
      <TabPanel value="sent">Sent panel</TabPanel>
      <TabPanel value="files">Files panel</TabPanel>
    </Tabs>
  ),
};

/** Mobile is a media query, never a prop: resize the viewport to see it change. */
export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <div style={{ display: "grid", gap: 32 }}>
      <Tabs defaultValue="emails" variant="pill">
        <TabList aria-label="Inbox sections, pill">
          <Tab value="emails">Emails</Tab>
          <Tab value="files" badge={{ label: "Warning", variant: "negative" }}>
            Files
          </Tab>
        </TabList>
        <TabPanel value="emails">Emails panel</TabPanel>
        <TabPanel value="files">Files panel</TabPanel>
      </Tabs>
      <Tabs defaultValue="emails" variant="underline">
        <TabList aria-label="Inbox sections, underline">
          <Tab value="emails">Emails</Tab>
          <Tab value="files" badge={{ label: "Warning", variant: "negative" }}>
            Files
          </Tab>
        </TabList>
        <TabPanel value="emails">Emails panel</TabPanel>
        <TabPanel value="files">Files panel</TabPanel>
      </Tabs>
    </div>
  ),
};

const overflowSections = [
  "Emails",
  "Files",
  "Archive",
  "Drafts",
  "Sent",
  "Spam",
  "Trash",
  "Scheduled",
];

/** Too many tabs for the viewport: the tablist scrolls, and so does the focused tab. */
export const Overflow: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Inbox sections">
        {overflowSections.map((section) => (
          <Tab key={section} value={section.toLowerCase()}>
            {section}
          </Tab>
        ))}
      </TabList>
      {overflowSections.map((section) => (
        <TabPanel key={section} value={section.toLowerCase()}>
          {section} panel
        </TabPanel>
      ))}
    </Tabs>
  ),
};

const emails = [
  { from: "Chiara", subject: "Contract renewal" },
  { from: "Luca", subject: "Claim #4821 updated" },
  { from: "Sara", subject: "Quote expires tomorrow" },
];

const files = ["Policy.pdf", "Invoice.pdf", "Claim form.pdf", "Receipt.png"];

// Demo content only: plain inline styles, never `ds-` classes.
const cardStyle = { border: "1px solid #d3d3dc", borderRadius: 8, padding: 12 };
const panelStyle = { marginTop: 24 };

const Inbox = () => {
  const [section, setSection] = useState("emails");

  return (
    <Tabs value={section} onValueChange={setSection} variant="pill">
      <TabList aria-label="Inbox sections">
        <Tab value="emails">Emails</Tab>
        <Tab value="files" badge={{ label: "Warning", variant: "negative" }}>
          Files
        </Tab>
        <Tab value="edits">Edits</Tab>
        <Tab value="downloads">Downloads</Tab>
        <Tab value="docs">Docs</Tab>
      </TabList>

      <TabPanel value="emails">
        <ul style={{ ...panelStyle, display: "grid", gap: 8, padding: 0, listStyle: "none" }}>
          {emails.map((email) => (
            <li key={email.subject} style={cardStyle}>
              <strong>{email.from}</strong> — {email.subject}
            </li>
          ))}
        </ul>
      </TabPanel>

      <TabPanel value="files">
        <div
          style={{
            ...panelStyle,
            display: "grid",
            gap: 8,
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          }}
        >
          {files.map((file) => (
            <div
              key={file}
              style={{ ...cardStyle, display: "grid", placeItems: "center", minHeight: 80 }}
            >
              {file}
            </div>
          ))}
        </div>
      </TabPanel>

      <TabPanel value="edits">
        <p style={panelStyle}>No pending edits.</p>
      </TabPanel>

      <TabPanel value="downloads">
        <p style={panelStyle}>Nothing downloaded in the last 30 days.</p>
      </TabPanel>

      <TabPanel value="docs">
        <p style={panelStyle}>Your signed documents will appear here.</p>
      </TabPanel>
    </Tabs>
  );
};

/** Switching a tab changes the content underneath. Controlled by the parent. */
export const SwitchingTabs: Story = {
  // The story ignores the args, so a "variant" control would be misleading.
  parameters: { controls: { disable: true } },
  render: () => <Inbox />,
};
