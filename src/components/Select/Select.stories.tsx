import { fn } from "@storybook/test";

import Select from "./Select";

const options = [
  {
    label: "Option 1",
    value: "option_1",
  },
  {
    label: "Option 2",
    value: "option_2",
  },
  {
    label: "Option 3",
    value: "option_3",
  },
  {
    label: "Option 4",
    value: "option_4",
  },
  {
    label: "Option 5",
    value: "option_5",
  },
];

export const ActionsData = {
  onChange: fn(),
};

export default {
  component: Select,
  title: "Select",
  tags: ["autodocs"],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
  },
};

export const Default = {
  args: {
    options,
  },
};

export const MultipleMode = {
  args: {
    ...Default.args,
    mode: "multiple",
  },
};
export const NoSearch = {
  args: {
    ...Default.args,
    withSearch: false,
  },
};
