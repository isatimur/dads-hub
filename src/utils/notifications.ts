import { sendEmail } from "./email";

export interface NotificationTemplateProps {
  recipientName: string;
  senderName?: string;
  postTitle?: string;
  commentContent?: string;
  moderationStatus?: string;
  moderationReason?: string;
}

export const sendCommentNotification = async (
  recipientEmail: string,
  { recipientName, senderName, postTitle, commentContent }: NotificationTemplateProps
) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Привет, ${recipientName}! 👋</h2>
      <p>${senderName || 'Кто-то'} ответил на ваш пост "${postTitle}":</p>
      <div style="padding: 15px; background: #f5f5f5; border-radius: 5px; margin: 15px 0;">
        "${commentContent}"
      </div>
      <p>Присоединяйтесь к разговору и продолжайте обсуждение!</p>
      <p>С наилучшими пожеланиями,<br/>Отец Молодец</p>
    </div>
  `;

  await sendEmail({
    to: [recipientEmail],
    subject: `${senderName || 'Кто-то'} ответил на ваш пост на Отец Молодец`,
    html,
  });
};

export const sendMentionNotification = async (
  recipientEmail: string,
  { recipientName, senderName, postTitle }: NotificationTemplateProps
) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Привет, ${recipientName}! 👋</h2>
      <p>${senderName || 'Кто-то'} упомянул вас в "${postTitle}"</p>
      <p>Проверьте разговор и присоединяйтесь!</p>
      <p>С наилучшими пожеланиями,<br/>Отец Молодец</p>
    </div>
  `;

  await sendEmail({
    to: [recipientEmail],
    subject: `${senderName || 'Кто-то'} упомянул вас в "${postTitle}" на Отец Молодец`,
    html,
  });
};

export const sendModerationNotification = async (
  recipientEmail: string,
  { recipientName, moderationStatus, moderationReason }: NotificationTemplateProps
) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Обновление модерации контента</h2>
      <p>Привет, ${recipientName},</p>
      <p>Ваш контент был ${moderationStatus}.</p>
      ${moderationReason ? `<p>Причина: ${moderationReason}</p>` : ''}
      <p>Если у вас есть вопросы, пожалуйста, обратитесь в нашу службу поддержки.</p>
      <p>С наилучшими пожеланиями,<br/>Отец Молодец</p>
    </div>
  `;

  await sendEmail({
    to: [recipientEmail],
    subject: `Обновление модерации контента на Отец Молодец`,
    html,
  });
};