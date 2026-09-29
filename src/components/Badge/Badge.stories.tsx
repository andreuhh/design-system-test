import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: "Badge", variant: "neutral" },
  argTypes: {
    variant: { control: "inline-radio", options: ["neutral", "positive", "negative"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};
export const Positive: Story = { args: { variant: "positive" } };
export const Negative: Story = { args: { variant: "negative" } };

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <Badge variant="neutral">Badge</Badge>
      <Badge variant="positive">Badge</Badge>
      <Badge variant="negative">Badge</Badge>
    </div>
  ),
};