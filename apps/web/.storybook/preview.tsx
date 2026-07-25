import "../src/app/globals.css";
import type { Preview } from "@storybook/nextjs-vite";
import { Providers } from "../src/components/providers/Providers";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Global theme for components",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === "dark";
      return (
        <div
          className={
            isDark
              ? "dark min-h-screen bg-background text-foreground"
              : "min-h-screen bg-background text-foreground"
          }
        >
          <Providers>
            <Story />
          </Providers>
        </div>
      );
    },
  ],
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#FFF8EE" },
        { name: "dark", value: "#111015" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
