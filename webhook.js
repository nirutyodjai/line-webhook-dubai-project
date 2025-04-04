export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const events = req.body.events || [];

  for (const event of events) {
    // ✅ กรณีบอทถูกเชิญเข้าห้อง LINE
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
              text: `👥 Group ID นี้คือ:\n${event.source.groupId}`
            }
          ]
        })
      });
    }

    // ✅ พิมพ์ว่า "เมนูผู้ดูแล" แล้วแสดงเมนู
    if (event.type === 'message' && event.message?.text === 'เมนูผู้ดูแล') {
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
              text: '📋 เมนูผู้ดูแลระบบ: จัดการอุปกรณ์, ดูภาพ, แบบฟอร์มตรวจสอบ, ส่งออก PDF, ตั้งค่าบอท'
            }
          ]
        })
      });
    }
  }

  return res.status(200).end();
}
