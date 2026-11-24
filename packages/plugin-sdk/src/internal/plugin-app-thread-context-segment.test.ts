import { expect, it } from "vitest";
import type { ExperimentalThreadContextSegmentRegistration } from "../app-contract.js";
import { collectPluginAppRegistrations } from "./plugin-app-collector.js";

const Summary = () => null;

function collect(contextKinds: unknown) {
  return collectPluginAppRegistrations({
    __bbPluginApp: true,
    setup(app) {
      app.slots.experimental_threadContextSegment({
        id: "deploy",
        title: "Deploy",
        group: "2_deploy",
        summary: Summary,
        ...(contextKinds === undefined
          ? {}
          : {
              contextKinds:
                contextKinds as ExperimentalThreadContextSegmentRegistration["contextKinds"],
            }),
      });
    },
  }).threadContextSegments.map((segment) => segment.contextKinds);
}

it.each([
  [undefined, ["banner", "card"]],
  [["banner"], ["banner"]],
  [
    ["card", "banner", "card"],
    ["banner", "card"],
  ],
])("collects segment context kinds %j as %j", (input, expected) => {
  expect(collect(input)).toEqual([expected]);
});

it.each([[[]], [["sidebar"]], ["banner"]])(
  "rejects segment context kinds %j",
  (input) => {
    expect(() => collect(input)).toThrow(
      /"contextKinds" must be a non-empty array/,
    );
  },
);
