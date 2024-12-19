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
      <h2>Hey ${recipientName}! 👋</h2>
      <p>${senderName || 'Someone'} replied to your post "${postTitle}":</p>
      <div style="padding: 15px; background: #f5f5f5; border-radius: 5px; margin: 15px 0;">
        "${commentContent}"
      </div>
      <p>Join the conversation and keep the discussion going!</p>
      <p>Best regards,<br/>The DadSpace Team</p>
    </div>
  `;

  await sendEmail({
    to: [recipientEmail],
    subject: `${senderName || 'Someone'} replied to your post on DadSpace`,
    html,
  });
};

export const sendMentionNotification = async (
  recipientEmail: string,
  { recipientName, senderName, postTitle }: NotificationTemplateProps
) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Hey ${recipientName}! 👋</h2>
      <p>${senderName || 'Someone'} mentioned you in "${postTitle}"</p>
      <p>Check out the conversation and join in!</p>
      <p>Best regards,<br/>The DadSpace Team</p>
    </div>
  `;

  await sendEmail({
    to: [recipientEmail],
    subject: `${senderName || 'Someone'} mentioned you on DadSpace`,
    html,
  });
};

export const sendModerationNotification = async (
  recipientEmail: string,
  { recipientName, moderationStatus, moderationReason }: NotificationTemplateProps
) => {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Content Moderation Update</h2>
      <p>Hey ${recipientName},</p>
      <p>Your content has been ${moderationStatus}.</p>
      ${moderationReason ? `<p>Reason: ${moderationReason}</p>` : ''}
      <p>If you have any questions, please contact our support team.</p>
      <p>Best regards,<br/>The DadSpace Team</p>
    </div>
  `;

  await sendEmail({
    to: [recipientEmail],
    subject: `DadSpace Content Moderation Update`,
    html,
  });
};