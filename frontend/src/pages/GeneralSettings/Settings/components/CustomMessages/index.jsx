import EditingChatBubble from "@/components/EditingChatBubble";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { Plus } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function CustomMessages() {
  const { t } = useTranslation();
  const [hasChanges, setHasChanges] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function fetchMessages() {
      const messages = await System.getWelcomeMessages();
      setMessages(messages);
    }
    fetchMessages();
  }, []);

  const addMessage = (type) => {
    if (type === "user") {
      setMessages([
        ...messages,
        {
          user: t("customization.items.welcome-messages.double-click"),
          response: "",
        },
      ]);
    } else {
      setMessages([
        ...messages,
        {
          user: "",
          response: t("customization.items.welcome-messages.double-click"),
        },
      ]);
    }
  };

  const removeMessage = (index) => {
    setHasChanges(true);
    setMessages(messages.filter((_, i) => i !== index));
  };

  const handleMessageChange = (index, type, value) => {
    setHasChanges(true);
    const newMessages = [...messages];
    newMessages[index][type] = value;
    setMessages(newMessages);
  };

  const handleMessageSave = async () => {
    const { success, error } = await System.setWelcomeMessages(messages);
    if (!success) {
      showToast(`Failed to update welcome messages: ${error}`, "error");
      return;
    }
    showToast("Successfully updated welcome messages.", "success");
    setHasChanges(false);
  };

  return (
    <div className="flex flex-col gap-y-0.5 my-4">
      <h2 className="text-sm leading-6 font-semibold text-white">
        {t("customization.items.welcome-messages.title")}
      </h2>
      <p className="text-xs text-white/60">
        {t("customization.items.welcome-messages.description")}
      </p>
      <div className="mt-2 flex flex-col gap-y-6 bg-theme-settings-input-bg rounded-lg pr-[31px] pl-[12px] pt-4 max-w-[700px]">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col gap-y-2">
            {message.user && (
              <EditingChatBubble
                message={message}
                index={index}
                type="user"
                handleMessageChange={handleMessageChange}
                removeMessage={removeMessage}
              />
            )}
            {message.response && (
              <EditingChatBubble
                message={message}
                index={index}
                type="response"
                handleMessageChange={handleMessageChange}
                removeMessage={removeMessage}
              />
            )}
          </div>
        ))}
        <div className="flex gap-4 mt-12 justify-between pb-[15px]">
          <button
            className="border-none self-end text-white hover:text-white/60 light:hover:text-black/60 transition"
            onClick={() => addMessage("response")}
          >
            <div className="flex items-center justify-start text-sm font-normal -ml-2">
              <Plus className="m-2" size={16} weight="bold" />
              <span className="leading-5">
                {t("customization.items.welcome-messages.new")}{" "}
                <span className="font-bold italic mr-1">
                  {t("customization.items.welcome-messages.system")}
                </span>{" "}
                {t("customization.items.welcome-messages.message")}
              </span>
            </div>
          </button>
          <button
            className="border-none self-end text-white hover:text-white/60 light:hover:text-black/60 transition"
            onClick={() => addMessage("user")}
          >
            <div className="flex items-center justify-start text-sm font-normal">
              <Plus className="m-2" size={16} weight="bold" />
              <span className="leading-5">
                {t("customization.items.welcome-messages.new")}{" "}
                <span className="font-bold italic mr-1">
                  {t("customization.items.welcome-messages.user")}
                </span>{" "}
                {t("customization.items.welcome-messages.message")}
              </span>
            </div>
          </button>
        </div>
      </div>
      {hasChanges && (
        <div className="flex justify-start pt-2">
          <button
            className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            onClick={handleMessageSave}
          >
            {t("customization.items.welcome-messages.save")}
          </button>
        </div>
      )}
    </div>
  );
}
