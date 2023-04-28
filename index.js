require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const { getImage, getChat } = require("./Helper/functions");
const { Telegraf } = require("telegraf");

const configuration = new Configuration({
  apiKey: process.env.API,
});
const openai = new OpenAIApi(configuration);
module.exports = openai;

const bot = new Telegraf(process.env.TG_API);
bot.start((ctx) =>
  ctx.reply(
    `Hey @${ctx.from.username}! 👋 \n\nI'm an AI bot based on the OpenAI chatGPT API. \nYou can ask me anything.`
  )
);

bot.help((ctx) => {
  ctx.reply(
    "I can perform the following commands: \n\n/image -> To create image from text. \n\n/ask -> Ask me anything.\n\nSend your question along with the commands!\n\nexample: /ask who is John Wick?"
  );
});

// about handler
const about = (ctx) => {
  ctx.replyWithHTML(
    `Github_Repo:  <a href="https://github.com/shadoworbs/chatgpt-bot-telegram">Click Here</a>\n\nOwner:  @shadoworbs\n\nOpenAI_Version:  <b>GPT 3.5</b>`,
    { disable_web_page_preview: true }
  );
};

// Image command
bot.command("image", async (ctx) => {
  const text = ctx.message.text?.replace("/image", "")?.trim().toLowerCase();

  if (text) {
    const res = await getImage(text);

    if (res) {
      ctx.sendChatAction("upload_photo");
      // ctx.sendPhoto(res);
      // ctx.telegram.sendPhoto()
      ctx.telegram.sendPhoto(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "You have to give some description after /image",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  }
});

// Chat command

bot.command("ask", async (ctx) => {
  const text = ctx.message.text?.replace("/ask", "")?.trim().toLowerCase();

  if (text) {
    ctx.sendChatAction("typing");
    const res = await getChat(text);
    if (res) {
      ctx.telegram.sendMessage(ctx.message.chat.id, res, {
        reply_to_message_id: ctx.message.message_id,
      });
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Please ask your query after /ask",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );

    //  reply("Please ask anything after /ask");
  }
});

// about command reg
bot.command("about", about);

bot.launch();
