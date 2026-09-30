// Imports go through the library barrel, exactly like a consumer would.
import { Tab, TabList, TabPanel, Tabs, type TabsVariant } from "./components";

const emails = [
  { from: "Chiara", subject: "Contract renewal" },
  { from: "Luca", subject: "Claim #4821 updated" },
  { from: "Sara", subject: "Quote expires tomorrow" },
];

const files = ["Policy.pdf", "Invoice.pdf", "Claim form.pdf", "Receipt.png"];

// Demo content only: plain inline styles, never `ds-` classes.
const cardStyle = { border: "1px solid #d3d3dc", borderRadius: 8, padding: 12 };
const panelStyle = { marginTop: 24 };

function Example({ variant }: { variant: TabsVariant }) {
  return (
    <Tabs defaultValue="emails" variant={variant}>
      <TabList aria-label={`Inbox sections, ${variant}`}>
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
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
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
}

export function App() {
  return (
    <main>
      <h1>Tabs</h1>
      <p>
        An accessible, reusable Tabs component with an optional Badge, built as a design system
        component.
      </p>

      <h2>Switching tabs — pill</h2>
      <Example variant="pill" />

      <h2>Switching tabs — underline</h2>
      <Example variant="underline" />

      <p>
        Run <code>pnpm storybook</code> for the full documentation: every variant, the Badge API,
        the mobile layout and the accessibility notes.
      </p>
    </main>
  );
}
