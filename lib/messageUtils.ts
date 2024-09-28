import { supabase } from "@/lib/supabaseClient";

export const editMessage = async (messageId: number, newContent: string): Promise<void> => {
  const { error } = await supabase
    .from("messages")
    .update({ content: newContent })
    .eq("id", messageId);

  if (error) {
    console.error("Error updating message:", error);
    throw new Error("Unable to update message");
  }
};
