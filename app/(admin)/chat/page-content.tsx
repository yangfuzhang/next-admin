"use client";
import { useState, useEffect, useMemo } from "react";
import { useApi } from "@/hooks";
import { Bot } from "@/types/bot";
import { BotList } from "./bot-list";
import { ChatBot } from "./chat-bot";

export function PageContent() {
  const { get, useQuery } = useApi();
  const { data, isFetching } = useQuery({
    queryKey: ["bots"],
    queryFn: () => {
      return get("/bots");
    },
  });

  const botList: Bot[] = useMemo(() => {
    return data ? data.items : [];
  }, [data]);
  const [currentBotId, setCurrentBotId] = useState<string>(botList[0]?.id);
  const currentBot = useMemo(() => {
    return botList.find((bot) => bot.id === currentBotId);
  }, [botList, currentBotId]);

  useEffect(() => {
    if (!botList.find((bot) => bot.id === currentBotId)) {
      setCurrentBotId(botList[0]?.id);
    }
  }, [botList, currentBotId]);

  return (
    <div className="flex flex-col items-start justify-center gap-4">
      <BotList
        loading={isFetching}
        bots={botList}
        currentBot={currentBot}
        onSelect={(bot) => {
          setCurrentBotId(bot.id);
        }}
      />
      <ChatBot bot={currentBot} />
    </div>
  );
}
