export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { messages } = req.body;

  const SYSTEM = `אתה עוזר ועד הבניין של הבניין ברחוב רועי קליין 10, רמת גן.
הבניין נמסר בנובמבר 2024 ומאז הועד אחראי על התקשורת עם הקבלן וחברת הניהול.

מה שאתה יודע:
- כתובת: רועי קליין 10, רמת גן
- תאריך מסירה: נובמבר 2024
- חברת ניהול: יהלום אדום
- הועד אחראי על: תקשורת מול קבלן, חברת ניהול, ועניינים שוטפים של הבניין

הנחיות:
- ענה בעברית בלבד, בצורה ידידותית וקצרה
- אם אין לך מידע ספציפי, אמור זאת בכנות והמלץ לפנות לועד
- לא להמציא מידע שאינך יודע בוודאות`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM,
        messages
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.content?.[0]?.text || 'שגיאה' });
  } catch (e) {
    res.status(500).json({ reply: 'אירעה שגיאה. נסה שוב.' });
  }
}
