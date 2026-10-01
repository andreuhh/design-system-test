import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactElement, useState } from "react";
import { axe } from "vitest-axe";
import { Tab, TabList, TabPanel, Tabs, type TabsVariant } from "./index";

/** Three tabs, so wrapping in both directions is observable. */
const inboxTabs = (
  <>
    <TabList aria-label="Inbox sections">
      <Tab value="emails">Emails</Tab>
      <Tab value="files" badge={{ label: "Warning", variant: "negative" }}>
        Files
      </Tab>
      <Tab value="archive">Archive</Tab>
    </TabList>
    <TabPanel value="emails">Emails panel</TabPanel>
    <TabPanel value="files">Files panel</TabPanel>
    <TabPanel value="archive">Archive panel</TabPanel>
  </>
);

const getTab = (name: string) => screen.getByRole("tab", { name });

afterEach(() => {
  // jsdom does not implement scrollIntoView: drop any mock installed by a test.
  Reflect.deleteProperty(Element.prototype, "scrollIntoView");
});

describe("Tabs", () => {
  describe("ARIA structure", () => {
    it("renders a named tablist with one tab per Tab", () => {
      render(<Tabs defaultValue="emails">{inboxTabs}</Tabs>);

      const tablist = screen.getByRole("tablist", { name: "Inbox sections" });
      expect(tablist).toBeInTheDocument();
      expect(screen.getAllByRole("tab")).toHaveLength(3);
    });

    it("links every tab to its panel in both directions", () => {
      render(<Tabs defaultValue="emails">{inboxTabs}</Tabs>);

      const tab = getTab("Emails");
      const panel = screen.getByRole("tabpanel");

      expect(tab).toHaveAttribute("aria-controls", panel.id);
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    });

    it("keeps tab and panel linked when the value contains spaces", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="emails">
          <TabList aria-label="Inbox sections">
            <Tab value="emails">Emails</Tab>
            <Tab value="my files">My files</Tab>
          </TabList>
          <TabPanel value="emails">Emails panel</TabPanel>
          <TabPanel value="my files">My files panel</TabPanel>
        </Tabs>,
      );

      await user.click(getTab("My files"));
      const tab = getTab("My files");
      const panel = screen.getByRole("tabpanel");

      expect(tab.id).not.toContain(" ");
      expect(panel.id).not.toContain(" ");
      expect(tab).toHaveAttribute("aria-controls", panel.id);
      expect(panel).toHaveAttribute("aria-labelledby", tab.id);
      expect(panel).toHaveAccessibleName("My files");
    });

    it("marks only the selected tab as selected", () => {
      render(<Tabs defaultValue="emails">{inboxTabs}</Tabs>);

      expect(getTab("Emails")).toHaveAttribute("aria-selected", "true");
      expect(getTab("Files Warning")).toHaveAttribute("aria-selected", "false");
      expect(getTab("Archive")).toHaveAttribute("aria-selected", "false");
    });

    it("keeps unselected panels mounted but hidden", () => {
      render(<Tabs defaultValue="emails">{inboxTabs}</Tabs>);

      expect(screen.getByText("Emails panel")).toBeVisible();
      expect(screen.getByText("Files panel")).not.toBeVisible();
      expect(screen.getAllByRole("tabpanel", { hidden: true })).toHaveLength(3);
    });

    it("exposes the tablist as a single tab stop (roving tabindex)", () => {
      render(<Tabs defaultValue="emails">{inboxTabs}</Tabs>);

      expect(getTab("Emails")).toHaveAttribute("tabindex", "0");
      expect(getTab("Files Warning")).toHaveAttribute("tabindex", "-1");
      expect(getTab("Archive")).toHaveAttribute("tabindex", "-1");
    });

    it("makes the selected panel focusable, so Tab leaves the tablist", async () => {
      const user = userEvent.setup();
      render(<Tabs defaultValue="emails">{inboxTabs}</Tabs>);

      await user.tab();
      expect(getTab("Emails")).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("tabpanel")).toHaveFocus();
    });
  });

  describe("keyboard navigation", () => {
    it("moves to the next tab with ArrowRight and selects it", async () => {
      const user = userEvent.setup();
      render(<Tabs defaultValue="emails">{inboxTabs}</Tabs>);

      await user.tab();
      await user.keyboard("{ArrowRight}");

      expect(getTab("Files Warning")).toHaveFocus();
      expect(getTab("Files Warning")).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText("Files panel")).toBeVisible();
    });

    it("moves to the previous tab with ArrowLeft", async () => {
      const user = userEvent.setup();
      render(<Tabs defaultValue="files">{inboxTabs}</Tabs>);

      await user.tab();
      await user.keyboard("{ArrowLeft}");

      expect(getTab("Emails")).toHaveFocus();
      expect(getTab("Emails")).toHaveAttribute("aria-selected", "true");
    });

    it("wraps from the last tab to the first with ArrowRight", async () => {
      const user = userEvent.setup();
      render(<Tabs defaultValue="archive">{inboxTabs}</Tabs>);

      await user.tab();
      await user.keyboard("{ArrowRight}");

      expect(getTab("Emails")).toHaveFocus();
    });

    it("wraps from the first tab to the last with ArrowLeft", async () => {
      const user = userEvent.setup();
      render(<Tabs defaultValue="emails">{inboxTabs}</Tabs>);

      await user.tab();
      await user.keyboard("{ArrowLeft}");

      expect(getTab("Archive")).toHaveFocus();
    });

    it("jumps to the first tab with Home and to the last with End", async () => {
      const user = userEvent.setup();
      render(<Tabs defaultValue="files">{inboxTabs}</Tabs>);

      await user.tab();
      await user.keyboard("{End}");
      expect(getTab("Archive")).toHaveFocus();
      expect(getTab("Archive")).toHaveAttribute("aria-selected", "true");

      await user.keyboard("{Home}");
      expect(getTab("Emails")).toHaveFocus();
      expect(getTab("Emails")).toHaveAttribute("aria-selected", "true");
    });

    it("ignores other keys", async () => {
      const user = userEvent.setup();
      render(<Tabs defaultValue="emails">{inboxTabs}</Tabs>);

      await user.tab();
      await user.keyboard("{ArrowDown}");

      expect(getTab("Emails")).toHaveFocus();
      expect(getTab("Emails")).toHaveAttribute("aria-selected", "true");
    });

    it("does nothing when the key reaches the tablist without a focused tab", () => {
      const onValueChange = vi.fn();
      render(
        <Tabs defaultValue="emails" onValueChange={onValueChange}>
          {inboxTabs}
        </Tabs>,
      );

      // user-event cannot do this: the tablist is not focusable.
      fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });

      expect(onValueChange).not.toHaveBeenCalled();
      expect(getTab("Emails")).toHaveAttribute("aria-selected", "true");
      expect(document.body).toHaveFocus();
    });

    it("scrolls the newly focused tab into view", async () => {
      const scrollIntoView = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoView;
      const user = userEvent.setup();
      render(<Tabs defaultValue="emails">{inboxTabs}</Tabs>);

      await user.tab();
      await user.keyboard("{ArrowRight}");

      expect(scrollIntoView).toHaveBeenCalledTimes(1);
      expect(scrollIntoView.mock.contexts[0]).toBe(getTab("Files Warning"));
    });

    it("lets a consumer onKeyDown opt out of the navigation", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="emails">
          <TabList aria-label="Inbox sections" onKeyDown={(event) => event.preventDefault()}>
            <Tab value="emails">Emails</Tab>
            <Tab value="files">Files</Tab>
          </TabList>
          <TabPanel value="emails">Emails panel</TabPanel>
          <TabPanel value="files">Files panel</TabPanel>
        </Tabs>,
      );

      await user.tab();
      await user.keyboard("{ArrowRight}");

      expect(getTab("Emails")).toHaveFocus();
      expect(getTab("Emails")).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("selection", () => {
    it("swaps the panel content on click", async () => {
      const user = userEvent.setup();
      render(<Tabs defaultValue="emails">{inboxTabs}</Tabs>);

      await user.click(getTab("Files Warning"));

      expect(screen.getByRole("tabpanel")).toHaveTextContent("Files panel");
      expect(screen.getByText("Emails panel")).not.toBeVisible();
    });

    it("does not notify when the already selected tab is clicked", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="emails" onValueChange={onValueChange}>
          {inboxTabs}
        </Tabs>,
      );

      await user.click(getTab("Emails"));

      expect(onValueChange).not.toHaveBeenCalled();
      expect(getTab("Emails")).toHaveAttribute("aria-selected", "true");
    });

    it("runs a consumer onClick before selecting", async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="emails">
          <TabList aria-label="Inbox sections">
            <Tab value="emails">Emails</Tab>
            <Tab value="files" onClick={onClick}>
              Files
            </Tab>
          </TabList>
          <TabPanel value="emails">Emails panel</TabPanel>
          <TabPanel value="files">Files panel</TabPanel>
        </Tabs>,
      );

      await user.click(getTab("Files"));

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(getTab("Files")).toHaveAttribute("aria-selected", "true");
    });

    it("lets a consumer onClick opt out of the selection", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="emails">
          <TabList aria-label="Inbox sections">
            <Tab value="emails">Emails</Tab>
            <Tab value="files" onClick={(event) => event.preventDefault()}>
              Files
            </Tab>
          </TabList>
          <TabPanel value="emails">Emails panel</TabPanel>
          <TabPanel value="files">Files panel</TabPanel>
        </Tabs>,
      );

      await user.click(getTab("Files"));

      expect(getTab("Emails")).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Emails panel");
    });
  });

  describe("controlled and uncontrolled", () => {
    it("owns its state when given a defaultValue", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="emails" onValueChange={onValueChange}>
          {inboxTabs}
        </Tabs>,
      );

      await user.click(getTab("Archive"));

      expect(getTab("Archive")).toHaveAttribute("aria-selected", "true");
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith("archive");
    });

    it("follows the parent when given a value", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Tabs value="emails" onValueChange={onValueChange}>
          {inboxTabs}
        </Tabs>,
      );

      await user.click(getTab("Archive"));

      expect(onValueChange).toHaveBeenCalledExactlyOnceWith("archive");
      expect(getTab("Emails")).toHaveAttribute("aria-selected", "true");
      expect(getTab("Archive")).toHaveAttribute("aria-selected", "false");
    });

    it("re-renders when the parent updates the value", async () => {
      const ControlledTabs = () => {
        const [value, setValue] = useState("emails");
        return (
          <Tabs value={value} onValueChange={setValue}>
            {inboxTabs}
          </Tabs>
        );
      };
      const user = userEvent.setup();
      render(<ControlledTabs />);

      await user.click(getTab("Files Warning"));

      expect(getTab("Files Warning")).toHaveAttribute("aria-selected", "true");
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Files panel");
    });
  });

  describe("badge", () => {
    it("includes the badge text in the accessible name", () => {
      render(<Tabs defaultValue="emails">{inboxTabs}</Tabs>);

      expect(getTab("Files Warning")).toBeInTheDocument();
      expect(screen.queryByRole("tab", { name: "FilesWarning" })).not.toBeInTheDocument();
    });

    it("renders the badge with the requested variant", () => {
      render(<Tabs defaultValue="emails">{inboxTabs}</Tabs>);

      expect(screen.getByText("Warning")).toHaveClass("ds-badge--negative");
    });

    it("leaves tabs without a badge untouched", () => {
      render(<Tabs defaultValue="emails">{inboxTabs}</Tabs>);

      expect(getTab("Emails")).toHaveAccessibleName("Emails");
    });
  });

  describe("consumer props", () => {
    it("ignores a data-value that would shadow the one keyboard navigation reads", async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="emails">
          <TabList aria-label="Inbox sections">
            <Tab value="emails">Emails</Tab>
            <Tab value="files" data-value="not-files">
              Files
            </Tab>
            <Tab value="archive">Archive</Tab>
          </TabList>
          <TabPanel value="emails">Emails panel</TabPanel>
          <TabPanel value="files">Files panel</TabPanel>
          <TabPanel value="archive">Archive panel</TabPanel>
        </Tabs>,
      );

      await user.tab();
      await user.keyboard("{ArrowRight}");

      expect(getTab("Files")).toHaveAttribute("aria-selected", "true");
      expect(screen.getByText("Files panel")).toBeVisible();
    });
  });

  describe("usage errors", () => {
    // Factories, not elements: Biome reads an array of JSX as a list to render.
    const orphans: Array<[string, () => ReactElement]> = [
      ["Tab", () => <Tab value="emails">Emails</Tab>],
      ["TabList", () => <TabList aria-label="Inbox sections" />],
      ["TabPanel", () => <TabPanel value="emails">Emails panel</TabPanel>],
    ];

    it.each(orphans)("throws when <%s> is rendered outside <Tabs>", (name, createOrphan) => {
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

      expect(() => render(createOrphan())).toThrow(`<${name}> must be rendered inside a <Tabs>.`);

      consoleError.mockRestore();
    });
  });

  describe("accessibility", () => {
    const variants: TabsVariant[] = ["pill", "underline"];

    it.each(variants)("has no accessibility violations (%s)", async (variant) => {
      const { container } = render(
        <Tabs defaultValue="emails" variant={variant}>
          {inboxTabs}
        </Tabs>,
      );

      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
