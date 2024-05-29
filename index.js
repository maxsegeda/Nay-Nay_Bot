const TelegramApi = require("node-telegram-bot-api");
const token = "7101459473:AAE0Ug6MZ5irLKtBJzAdqK-c0BS6Pmk23vY";
const bot = new TelegramApi(token, { polling: true });
const fs = require("fs");


const setCommands = () => {
  bot.setMyCommands([{ command: "/start", description: "Старт" }]);
};
let usersData = [];
const userDataFilePath = "users.json";
if (fs.existsSync(userDataFilePath)) {
  const rawData = fs.readFileSync(userDataFilePath);
  usersData = JSON.parse(rawData);
}

// Объект для хранения времени последней отправки приветствия для каждого пользователя
const lastGreetingTime = {};

// Функция для сохранения данных о пользователях в файл
const saveUsersData = () => {
  const jsonData = JSON.stringify(usersData, null, 2);
  fs.writeFileSync(userDataFilePath, jsonData);
  console.log("Данные пользователей успешно сохранены в файл.");
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  // Проверяем, добавлен ли пользователь уже в массив данных
  const existingUser = usersData.find((user) => user.username === username);
  if (existingUser) {
    // Отправляем повторное приветствие
    const welcomeBackMessage = `Вітаємо 👋, запрошуємо вас приєднатись\nдо нашого офіційного телеграм-бота,\nде ви зможете отримувати наші новини, \nінформацію про акції та інше 🗣`;
    bot.sendMessage(chatId, welcomeBackMessage, getMainMenuMarkup());
    return;
  }

  // Отправляем первое приветствие и добавляем нового пользователя в массив
  const welcomeMessage = ``;
  bot.sendMessage(chatId, welcomeMessage, getMainMenuMarkup());
  usersData.push({ username, chatId });

  saveUsersData();

  console.log("Приветствие отправлено для нового пользователя:", username);
});

// Функция для получения разметки главного меню
function getMainMenuMarkup() {
  return {
    reply_markup: {
      keyboard: [
        [
          { text: "Адреси наших магазинів 🗺" },
          { text: "Звʼязатися з менеджером 📞" },
        ],
        [
          { text: "Графік роботи 🕘" },
          { text: "Наші сторінки в соціальних мережах 📱" },
        ],
        [{ text: "Оцініть нас! 💯" }, { text: "Є робота! 👨‍💼" }],
      ],
      resize_keyboard: true,
    },
  };
}
bot.onText(/Адреси наших магазинів 🗺/, (msg) => {
  const chatId = msg.chat.id;
  const addressMessage = `<b>Оберіть ваше місто aбо область 🌆</b>`;
  const cityKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Чернівці", callback_data: "city_chernivtsi" },
          { text: "Чернівецька обл.", callback_data: "chernivtsi_region" },
        ],
        [
          { text: "Хмельницька обл.", callback_data: "khmelnytskyi_region" },
          {
            text: "Івано-Франківська обл.",
            callback_data: "ivano-Frankivsk_region",
          },
        ],
      ],
    },
    parse_mode: "HTML",
  };
  bot.sendMessage(chatId, addressMessage, cityKeyboard);
});

bot.on("callback_query", (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;
  switch (data) {
    case "city_chernivtsi":
      sendAddresses(
        chatId,
        " Місто Чернівці:\nвул. Головна , буд. 189\n вул. Головна , буд. 204-б (Ентузіастів)\nвул. Комарова , буд. 13\n вул. Комарова , буд. 15\nвул. Полєтаєва, буд. 2-а\n вул. Південно кільцева, буд. 25\nвул. І. Франка, буд. 16\n вул. Шкільна, буд. 1\nвул. Горіхівська, буд. 14\n вул. Руська, буд. 248-б\nвул. Чкалова, буд. 13 (ОФІС/СКЛАД)\n вул. Миколаївська, буд. 8-в (СКЛАД)\nпроспект Незалежновсті, буд. 111\n проспект Незалежновсті, буд. 86 "
      );
      break;
    case "chernivtsi_region":
      sendAddresses(
        chatId,
        "  Чернівецька область:\nм. Хотин вул. Олімпійська, буд. 80\n Кіцманський р-н, с. Мамаївці, вул. Шевченка, буд. 153 \nм. Сторожинець вул. Федьковича, буд. 3\n смт. Глибока вул. Базарна, буд. 1-а \nм. Новоселиця вул. Центральна, буд. 72 \n смт. Лужани вул. Центральна, буд. 61\nм. Герца вул. Горького, буд.1"
      );
      break;
    case "khmelnytskyi_region":
      sendAddresses(
        chatId,
        "  Хмельницька область:\nм. Кам'ненець - Подільський, вул. Васильєва, буд. 1\n м. Кам'ненець - Подільський, вул. Д. Галицького, буд. 13\nм. Дунаївці, вул. Шевченка, буд. 111-а\n м. Хмельницький, вул. С. Бандери , буд. 2/1-А, приміщення №117\nсмт.Ярмолинці, вул.Хмельницька,3\n м. Хмельницький, вул. Свободи 1а"
      );
      break;
    case "ivano-Frankivsk_region":
      sendAddresses(
        chatId,
        "  Івано-Франківська область:\nм. Коломия вул.Гетьмана І. Мазепи, буд. 81/1\n смт.Делятин вул.16 липня 222"
      );
      break;
  }
});

function sendAddresses(chatId, addresses) {
  bot.sendMessage(chatId, addresses);
}

bot.onText(/Графік роботи 🕘/, (msg) => {
  const chatId = msg.chat.id;
  const addressMessage = `Мипрацюємо без вихідних з понеділка по неділю 🗓\nЗ 08:00 до 21:00 🛒`;
  bot.sendMessage(chatId, addressMessage);
});
bot.onText(/Наші сторінки в соціальних мережах 📱/, (msg) => {
  const chatId = msg.chat.id;
  const addressMessage = `Наша інстаграмм сторінка 📷\nhttps://www.instagram.com/supereconom.ua?igsh=MWRrdzZzb2R0MDU0OA==\nМи в фейсбук\nсторінка ще в розробці(`;
  bot.sendMessage(chatId, addressMessage);
});
bot.onText(/Звʼязатися з менеджером 📞/, (msg) => {
  const chatId = msg.chat.id;
  const addressMessage = `Натисніть кнопку та ми зв'яжемося з вами найближчим часом ☎️`;
  const cityKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Cick here", callback_data: "contact_themanager" }],
      ],
    },
    parse_mode: "HTML",
  };
  bot.sendMessage(chatId, addressMessage, cityKeyboard);
});
bot.on("callback_query", (callbackQuery) => {
  const username = callbackQuery.from.username;
  const messageId = callbackQuery.message.message_id;
  if (callbackQuery.data == "contact_themanager") {
    bot.sendMessage("622782478", `Користувач @${username} потребує допомоги.`, {
      reply_to_message_id: messageId,
    });
  }
});

bot.onText(/Оцініть нас! 💯/, (msg) => {
  const chatId = msg.chat.id;
  const addressMessage = `Пройдіть будь-ласка опитування 🙂\nhttps://forms.gle/h177V3gN8R39KpYx9`;
  bot.sendMessage(chatId, addressMessage);
});
bot.onText(/Є робота! 👨‍💼/, (msg) => {
  const chatId = msg.chat.id;
  const addressMessage = `Вільні вакансії 👨‍💼\nhttps://forms.gle/zDa3ab7kSLu8F2Bg9`;
  bot.sendMessage(chatId, addressMessage);
});
let users = [];
let message = "";
let photoFileId = "";
fs.readFile(userDataFilePath, (err, data) => {
  if (err) {
    console.error("Ошибка при чтении файла пользователей:", err);
    return;
  }
  try {
    users = JSON.parse(data);
    console.log("Данные пользователей успешно загружены.");
  } catch (error) {
    console.error("Ошибка при парсинге данных пользователей:", error);
  }
});
bot.onText(/\/sendtext ([\s\S]*)/, (msg, match) => {
  if (msg.from.username == "max_segeda" || username == "sirkosmm") {
    const inputMessage = match[1];
    if (inputMessage) {
      message = inputMessage;
      const userId = msg.chat.id;
      bot.sendMessage(
        userId,
        "Текст для розсилка встановлено. Щоб відправити його, використайте команду /sendalltext: " +
          message
      );
    } else {
      const userId = msg.chat.id;
      bot.sendMessage(
        userId,
        "Пожалуйста, укажите сообщение для рассылки после команды /send"
      );
    }
  } else {
    const userId = msg.chat.id;
    bot.sendMessage(
      userId,
      "У вас нет прав для установки сообщения для рассылки!"
    );
  }
});

bot.on("photo", (msg) => {
  const username = msg.from.username;
  if (username === "max_segeda" || username === "sirkosmm") {
    const fileId = msg.photo[0].file_id;
    const chatId = msg.chat.id;

    if (msg.caption && msg.caption.startsWith("/sendphoto")) {
      photoFileId = fileId;
      bot.sendPhoto(chatId, fileId, {
        caption:
          "Фото для розсилки встановлено. Щоб відправити його, використайте команду /sendallphoto",
      });
    }
  } else {
    const userId = msg.chat.id;
    bot.sendMessage(userId, "У вас нет прав для установки фото для рассылки!");
  }
});

bot.onText(/\/sendalltext/, async (msg) => {
  users.forEach((user) => {
    if (user.chatId) {
      bot
        .sendMessage(user.chatId, message)
        .catch((error) =>
          console.error("Ошибка при отправке сообщения:", error)
        );
    } else {
      console.error(
        "Ошибка: chat_id отсутствует или не корректен для пользователя",
        user
      );
    }
  });
  const userId = msg.chat.id;
  await bot.sendMessage(userId, "Розсилка тексту закінчена!");

  message = "";
});

bot.onText(/\/sendallphoto/, async (msg) => {
  users.forEach((user) => {
    if (user.chatId) {
      bot
        .sendPhoto(user.chatId, photoFileId)
        .catch((error) => console.error("Ошибка при отправке фото:", error));
    } else {
      console.error(
        "Ошибка: chat_id отсутствует или не корректен для пользователя",
        user
      );
    }
  });

  if (photoFileId) {
    const userId = msg.chat.id;
    await bot.sendMessage(userId, "Розсилка фото закінчена!");
  }

  photoFileId = "";
});
setCommands();
