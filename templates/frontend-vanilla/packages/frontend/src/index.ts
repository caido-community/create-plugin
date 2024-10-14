import "./styles/index.css";

import type { FrontendSDK } from "./types";

import manifest from "../../../manifest.json" with { type: "json" };

// This is the entry point for the frontend plugin
export const init = (sdk: FrontendSDK) => {

  // Create the root element for the app
  const root = document.createElement("div");
  Object.assign(root.style, {
    height: "100%",
    width: "100%",
  });

  // Set the ID of the root element
  // We use the manifest ID to ensure that the ID is unique per-plugin
  // This is necessary to prevent styling conflicts between plugins
  // The value here should be the same as the prefixWrap plugin in postcss.config.js
  root.id = `plugin--${manifest.id}`;

  // Create the parent element
  const parent = document.createElement("div");
  parent.classList.add("h-full", "flex", "justify-center", "items-center");

  // Create the container element
  const container = document.createElement("div");
  container.classList.add("flex", "flex-col", "gap-1");

  // Create the input element
  const input = document.createElement("input");
  input.classList.add(
    "bg-gray-50",
    "border",
    "border-gray-300",
    "text-gray-900",
    "text-sm",
    "rounded-lg",
    "focus:ring-blue-500",
    "focus:border-blue-500",
    "block",
    "w-full",
    "p-2.5",
    "dark:bg-gray-700",
    "dark:border-gray-600",
    "dark:placeholder-gray-400",
    "dark:text-white",
    "dark:focus:ring-blue-500",
    "dark:focus:border-blue-500"
  );
  input.type = "text";
  input.placeholder = "Hello world";
  input.readOnly = true;

  // Create the button element
  const button = document.createElement("button");
  button.classList.add(
    "middle",
    "none",
    "center",
    "mr-3",
    "rounded-lg",
    "bg-primary-400",
    "py-3",
    "px-6",
    "font-sans",
    "text-xs",
    "font-bold",
    "uppercase",
    "text-white",
    "shadow-md",
    "shadow-pink-500/20",
    "transition-all",
    "hover:shadow-lg",
    "hover:shadow-pink-500/40",
    "focus:opacity-[0.85]",
    "focus:shadow-none",
    "active:opacity-[0.85]",
    "active:shadow-none",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "disabled:shadow-none"
  );
  button.textContent = "Generate random string";
  button.addEventListener("click", () => {
    // Call the backend to generate a random string
    sdk.backend.generateRandomString(10).then((result) => {
      // Set the value of the input element
      input.value = result;
    });
  });

  // Attach the elements to the container
  container.appendChild(input);
  container.appendChild(button);

  // Attach the container to the parent
  parent.appendChild(container);

  // Attach the parent to the root
  root.appendChild(parent);

  // Add the page to the navigation
  // Make sure to use a unique name for the page
  sdk.navigation.addPage("/my-plugin", {
    body: root,
  });

  // Add a sidebar item
  sdk.sidebar.registerItem("My Plugin", "/my-plugin");
};
