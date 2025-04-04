
// LINE Webhook Handler (Single file test version)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const events = req.body.events || [];

  for (const event of events) {
    // ตอบกลับเมื่อบอทถูกเชิญเข้าห้อง
    if (event.type === 'join' && event.source?.groupId) {
      await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          to: event.source.groupId,
          messages: [
            {
              type: 'text',
              text: '🤖 Bot Online แล้วจ้า!'
            }
          ]
        })
      });
    }

    // ตอบกลับเมื่อมีคนพิมพ์คำว่า test
    if (event.type === 'message' && event.message?.text.toLowerCase().includes('test')) {
      await fetch('https://api.line.me/v2/bot/message/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: '✅ Webhook ทำงาน OK แล้ว!'
            }
          ]
        })
      });
    }
  }

  return res.status(200).end();
}
