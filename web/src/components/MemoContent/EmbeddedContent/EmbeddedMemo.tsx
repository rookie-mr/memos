import { useContext, useEffect } from "react";
import { useMemoStore } from "@/store/v1";
import MemoContent from "..";
import { RendererContext } from "../types";
import Error from "./Error";

interface Props {
  memoId: number;
  params: string;
}

const EmbeddedMemo = ({ memoId }: Props) => {
  const context = useContext(RendererContext);
  const memoStore = useMemoStore();
  const memo = memoStore.getMemoById(memoId);
  const resourceName = `memos/${memoId}`;

  useEffect(() => {
    memoStore.getOrFetchMemoById(memoId);
  }, [memoId]);

  if (!memo) {
    return null;
  }
  if (memoId === context.memoId || context.embeddedMemos.has(resourceName)) {
    return <Error message={`Nested Rendering Error: ![[${resourceName}]]`} />;
  }

  // Add the memo to the set of embedded memos. This is used to prevent infinite loops when a memo embeds itself.
  context.embeddedMemos.add(resourceName);
  return <MemoContent nodes={memo.nodes} memoId={memoId} embeddedMemos={context.embeddedMemos} />;
};

export default EmbeddedMemo;