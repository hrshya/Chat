import { supabase } from "@/lib/supabaseClient";

export const editMessage = async (messageId: number, newContent: string) => {
    try {
      const { error: updateError } = await supabase
        .from('messages')
        .update({ content: newContent, is_edited: true })
        .eq('id', messageId);
  
      if (updateError) {
        console.error('Error updating message:', updateError);
        return;
      }
  
      const { error: insertError } = await supabase.from('branches').insert({
        message_id: messageId,
        branch_content: newContent,
      });
  
      if (insertError) {
        console.error('Error inserting branch:', insertError);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
};
  