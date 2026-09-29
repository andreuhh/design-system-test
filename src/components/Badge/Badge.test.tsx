import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Badge, type BadgeVariant } from "./Badge";

const variants: BadgeVariant[] = ["neutral", "positive", "negative"];

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge>Warning</Badge>);
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("uses the neutral variant by default", () => {
    render(<Badge>Warning</Badge>);
    expect(screen.getByText("Warning")).toHaveClass("ds-badge--neutral");
  });

  it.each(variants)("applies the %s variant", (variant) => {
    render(<Badge variant={variant}>Warning</Badge>);
    expect(screen.getByText("Warning")).toHaveClass(`ds-badge--${variant}`);
  });

  it("forwards native attributes", () => {
    render(<Badge data-testid="badge" title="3 warnings">Warning</Badge>);
    expect(screen.getByTestId("badge")).toHaveAttribute("title", "3 warnings");
  });

  it.each(variants)("has no accessibility violations (%s)", async (variant) => {
    const { container } = render(<Badge variant={variant}>Warning</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});