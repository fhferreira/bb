import {
  experimental_THREAD_INFO_SECTION_GROUPS,
  type ExperimentalThreadContextCardProps,
  type PluginSidebarThread,
} from "@get-bb/plugin-sdk";
import {
  definePluginApp,
  experimental_InfoList as InfoList,
  experimental_InfoSection as InfoSection,
  experimental_resolveThreadStatus,
  experimental_ThreadContextCardRow as ThreadContextCardRow,
  experimental_ThreadStatusGlyph as ThreadStatusGlyph,
  experimental_ThreadTitleText as ThreadTitleText,
  experimental_useSidebarThreads as useSidebarThreads,
  useBbNavigate,
  useSidebarThreadDraft,
  useSidebarThreadRowStatus,
} from "@get-bb/plugin-sdk/app";
import { Icon } from "@bb/shared-ui/icon";
import { InfoRowTime } from "@bb/shared-ui/info-list-row";

function rawDisplayTitle(thread: PluginSidebarThread): string {
  if (thread.title !== null && thread.title.trim().length > 0) {
    return thread.title;
  }
  if (thread.titleFallback !== null && thread.titleFallback.trim().length > 0) {
    return thread.titleFallback;
  }
  return `Thread ${thread.id.slice(0, 8)}`;
}

function ChildThreadGlyph({ thread }: { thread: PluginSidebarThread }) {
  const { hasUnsubmittedDraft } = useSidebarThreadDraft(thread.id);
  const rowStatus = useSidebarThreadRowStatus(thread.id);
  const status = experimental_resolveThreadStatus({
    thread,
    hiddenThreads: [],
    hasUnsubmittedDraft,
    rowStatus,
  });
  if (status.indicator === "none" && status.rowStatus === null) {
    return <Icon name="ChildThread" aria-hidden />;
  }
  return (
    <ThreadStatusGlyph
      indicator={status.indicator}
      rowStatus={status.rowStatus}
      size="compact"
    />
  );
}

function ChildThreadRow({ thread }: { thread: PluginSidebarThread }) {
  const navigate = useBbNavigate();
  const title = rawDisplayTitle(thread);
  return (
    <li className="list-none">
      <ThreadContextCardRow
        leading={<ChildThreadGlyph thread={thread} />}
        label={<ThreadTitleText title={title} />}
        title={title}
        trailing={<InfoRowTime timestamp={thread.updatedAt} />}
        onClick={() => navigate.toThread(thread.id)}
      />
    </li>
  );
}

function ChildThreadsSection({ threadId }: ExperimentalThreadContextCardProps) {
  const { threads } = useSidebarThreads();
  const children = threads.filter(
    (thread) =>
      thread.parentThreadId === threadId &&
      !thread.isHidden &&
      thread.originKind === null,
  );
  if (children.length === 0) return null;
  return (
    <InfoSection label="Child threads" count={children.length}>
      <InfoList
        items={children}
        getKey={(child) => child.id}
        limit={4}
        renderItem={(child) => <ChildThreadRow thread={child} />}
      />
    </InfoSection>
  );
}

export default definePluginApp((app) => {
  app.slots.experimental_threadContextCardSection({
    id: "childThreads",
    group: experimental_THREAD_INFO_SECTION_GROUPS.related,
    order: 10,
    component: ChildThreadsSection,
  });
});
