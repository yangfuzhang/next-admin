"use client";
import { useEffect } from "react";
import { Bot } from "@/types/bot";

export function ChatBot({ bot }: { bot: Bot | undefined }) {
  useEffect(() => {
    if (!bot?.botId) {
      return;
    }

    const bot_id = bot.botId;
    const title = bot.name;
    const icon =
      "https://lf-bot-studio-plugin-resource.coze.cn/obj/bot-studio-platform-plugin-tos/artist/image/7e813aa2c7e14ebb9e2d1a989acfb128.png";
    const lang = "zh-CN";
    const layout = "pc";
    const el = document.getElementById("bot-root");

    const { CozeWebSDK } = window;
    const client = new CozeWebSDK.WebChatClient({
      config: {
        bot_id,
      },
      componentProps: {
        title,
        icon,
        layout,
      },
      el,
    });

    setTimeout(() => {
      const imgs = el?.getElementsByTagName("img");
      const img = imgs?.[0];

      if (img) {
        img.click();
      }
    }, 0);

    return () => {
      client.destroy();
    };
  }, [bot?.botId, bot?.name]);

  return <div id="bot-root" className="fixed right-10 bottom-10"></div>;
}
