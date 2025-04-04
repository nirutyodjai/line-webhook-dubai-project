export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const events = req.body.events || [];

  for (const event of events) {
    // ✅ ตอบกลับเมื่อ Bot ถูกเชิญเข้ากลุ่ม
    if (event.type === 'join' && event.source?.groupId) {
      await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.LINE_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          to: event.source.groupId,
          messages: [
            {
              type: 'text',
              text: `👥 Group ID นี้คือ:\n${event.source.groupId}`
            }
          ]
        })
      });
    }
  }

  return res.status(200).end();
}
