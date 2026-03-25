import type { WordPressGlobalsMap } from "../shared/types";

const WORDPRESS_PACKAGES = [
  "a11y",
  "annotations",
  "api-fetch",
  "autop",
  "blob",
  "block-directory",
  "block-editor",
  "block-library",
  "block-serialization-default-parser",
  "blocks",
  "commands",
  "components",
  "compose",
  "core-commands",
  "core-data",
  "customize-widgets",
  "data",
  "data-controls",
  "date",
  "deprecated",
  "dom",
  "dom-ready",
  "edit-post",
  "edit-site",
  "edit-widgets",
  "editor",
  "element",
  "escape-html",
  "fields",
  "format-library",
  "hooks",
  "html-entities",
  "i18n",
  "is-shallow-equal",
  "keyboard-shortcuts",
  "keycodes",
  "list-reusable-blocks",
  "media-utils",
  "notices",
  "nux",
  "patterns",
  "plugins",
  "preferences",
  "preferences-persistence",
  "primitives",
  "priority-queue",
  "private-apis",
  "redux-routine",
  "reusable-blocks",
  "rich-text",
  "router",
  "server-side-render",
  "shortcode",
  "style-engine",
  "token-list",
  "undo-manager",
  "url",
  "viewport",
  "warning",
  "widgets",
  "wordcount",
];

const CLASSIC_GLOBALS: WordPressGlobalsMap = {
  backbone: "Backbone",
  jquery: "jQuery",
  lodash: "lodash",
  moment: "moment",
  tinymce: "tinymce",
};

const REACT_GLOBALS: WordPressGlobalsMap = {
  react: "React",
  "react-dom": "ReactDOM",
  "react-dom/client": "ReactDOM",
  "react/jsx-dev-runtime": "ReactJSXRuntime",
  "react/jsx-runtime": "ReactJSXRuntime",
};

const WORDPRESS_GLOBALS = Object.fromEntries(
  WORDPRESS_PACKAGES.map((handle) => [`@wordpress/${handle}`, `wp.${camelCaseDash(handle)}`]),
) as WordPressGlobalsMap;

export function getWordPressGlobals(
  preset: "wordpress" | "wordpress+react" = "wordpress+react",
): WordPressGlobalsMap {
  if (preset === "wordpress") {
    return {
      ...CLASSIC_GLOBALS,
      ...WORDPRESS_GLOBALS,
    };
  }

  return {
    ...CLASSIC_GLOBALS,
    ...REACT_GLOBALS,
    ...WORDPRESS_GLOBALS,
  };
}

function camelCaseDash(value: string): string {
  return value.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
}
