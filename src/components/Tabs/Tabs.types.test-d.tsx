/**
 * Type-level regression tests: they have no runtime assertions and are not run by
 * Vitest (the include pattern is `*.test.{js,ts,tsx}`), but `pnpm tsc` checks them.
 * A `@ts-expect-error` that stops erroring is itself a compile error, so these
 * cases fail loudly if the props unions are ever loosened.
 */
import { Tab, TabList, TabPanel, Tabs } from "./index";

const noop = (_value: string) => undefined;

export const Uncontrolled = () => (
  <Tabs defaultValue="emails" variant="underline">
    <TabList aria-label="Inbox sections">
      <Tab value="emails">Emails</Tab>
      <Tab value="files" badge={{ label: "Warning", variant: "negative" }}>
        Files
      </Tab>
    </TabList>
    <TabPanel value="emails">Emails</TabPanel>
    <TabPanel value="files">Files</TabPanel>
  </Tabs>
);

export const Controlled = () => (
  <Tabs value="emails" onValueChange={noop}>
    <TabList aria-labelledby="inbox-heading">
      <Tab value="emails">Emails</Tab>
    </TabList>
    <TabPanel value="emails">Emails</TabPanel>
  </Tabs>
);

export const ControlledWithoutHandler = () => (
  // @ts-expect-error controlled mode requires onValueChange
  <Tabs value="emails">
    <TabList aria-label="Inbox sections">
      <Tab value="emails">Emails</Tab>
    </TabList>
  </Tabs>
);

export const BothValues = () => (
  // @ts-expect-error value and defaultValue are mutually exclusive
  <Tabs value="emails" defaultValue="files" onValueChange={noop}>
    <TabList aria-label="Inbox sections">
      <Tab value="emails">Emails</Tab>
    </TabList>
  </Tabs>
);

export const NoValue = () => (
  // @ts-expect-error one of value or defaultValue is required: "nothing selected" is not a state
  <Tabs>
    <TabList aria-label="Inbox sections">
      <Tab value="emails">Emails</Tab>
    </TabList>
  </Tabs>
);

export const TabListWithoutName = () => (
  <Tabs defaultValue="emails">
    {/* @ts-expect-error a tablist needs aria-label or aria-labelledby */}
    <TabList>
      <Tab value="emails">Emails</Tab>
    </TabList>
  </Tabs>
);

export const TabListWithBothNames = () => (
  <Tabs defaultValue="emails">
    {/* @ts-expect-error aria-label and aria-labelledby are mutually exclusive */}
    <TabList aria-label="Inbox sections" aria-labelledby="inbox-heading">
      <Tab value="emails">Emails</Tab>
    </TabList>
  </Tabs>
);

export const StylingHooksAreClosed = () => (
  <Tabs defaultValue="emails">
    <TabList aria-label="Inbox sections">
      {/* @ts-expect-error className is owned by the component */}
      <Tab value="emails" className="my-tab">
        Emails
      </Tab>
    </TabList>
    {/* @ts-expect-error the hidden attribute is managed internally */}
    <TabPanel value="emails" hidden>
      Emails
    </TabPanel>
  </Tabs>
);
