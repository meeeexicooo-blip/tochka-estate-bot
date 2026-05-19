
const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = 'PASTE_YOUR_BOT_TOKEN';
const ADMIN_ID = 'PASTE_YOUR_TELEGRAM_ID';

const bot = new Telegraf(BOT_TOKEN);

const objects = [
  { id:1, title:'Офис в Москва-Сити', price:'420 000 ₽/мес', area:'180 м²' },
  { id:2, title:'Склад', price:'250 000 ₽/мес', area:'500 м²' }
];

bot.start((ctx)=>{
  ctx.reply(
    '🏢 Точка Недвижимости',
    Markup.keyboard([
      ['📋 Каталог'],
      ['📞 Связаться']
    ]).resize()
  );
});

bot.hears('📋 Каталог', async (ctx)=>{
  for(const obj of objects){
    await ctx.reply(
`🏢 ${obj.title}

📐 ${obj.area}
💰 ${obj.price}`,
Markup.inlineKeyboard([
[Markup.button.callback('📩 Оставить заявку', `lead_${obj.id}`)]
])
);
  }
});

bot.action(/lead_(\d+)/, async (ctx)=>{
  const id = Number(ctx.match[1]);
  const obj = objects.find(o=>o.id===id);

  await ctx.reply('✅ Заявка отправлена');

  await bot.telegram.sendMessage(
    ADMIN_ID,
`🔥 Новая заявка

Объект: ${obj.title}
Клиент: @${ctx.from.username || 'нет username'}`
  );
});

bot.hears('📞 Связаться', (ctx)=>{
  ctx.reply('📱 Брокер: +7 (900) 000-00-00');
});

bot.launch();
console.log('Bot started');
