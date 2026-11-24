import childThreads from "@/core-contributions/child-threads";
import parentThread from "@/core-contributions/parent-thread";
import { collectCoreContributionSlots } from "@/lib/core-contributions";

const DEFINITIONS = [parentThread, childThreads];

export const CORE_THREAD_CONTEXT_SEGMENTS = DEFINITIONS.flatMap((definition) =>
  collectCoreContributionSlots(definition, "threadContextSegments"),
);

export const CORE_THREAD_CONTEXT_CARD_ROWS = DEFINITIONS.flatMap((definition) =>
  collectCoreContributionSlots(definition, "threadContextCardRows"),
);

export const CORE_THREAD_CONTEXT_CARD_SECTIONS = DEFINITIONS.flatMap(
  (definition) =>
    collectCoreContributionSlots(definition, "threadContextCardSections"),
);
