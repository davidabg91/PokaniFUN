import { createContext, useContext, useState, useCallback } from 'react'

/* ------------------------------------------------------------------ *
 *  All translatable text lives here, keyed by language.
 *  Values may be strings, arrays, or functions (for interpolation).
 * ------------------------------------------------------------------ */
const STRINGS = {
  bg: {
    /* --- Create page --- */
    create_title: 'Покани ме',
    create_subtitle: 'Създай супер забавна покана и прати линка на специалния човек.',
    field_your_name: 'Твоето име',
    ph_your_name: 'напр. Алекс',
    field_recipient_name: 'Име на човека (по желание)',
    ph_recipient_name: 'напр. Мария',
    field_kind: 'Каква е поканата?',
    kind_romantic: '💕 Романтична',
    kind_friendly: '🎉 Приятелска',
    field_recipient: 'До кого я пращаш?',
    gender_female: 'Жена',
    gender_male: 'Мъж',
    gender_other: 'Друго',
    field_message: 'Лично съобщение (по желание)',
    ph_message: 'Нещо сладко, смешно или мистериозно...',
    field_photo: 'Твоя снимка (по желание)',
    field_voice: 'Гласово съобщение (по желание)',
    err_name: 'Напиши си името 🙂',
    btn_creating: 'Създавам... ✨',
    btn_create: 'Създай поканата 💌',
    created_title: 'Готово! 🎉',
    created_share_line: 'Прати този линк на специалния човек:',
    btn_copy: 'Копирай',
    btn_preview: '👀 Виж как изглежда',
    btn_share: '📤 Сподели',
    result_link_title: '🔔 Линк за теб (за отговора):',
    result_link_desc: 'Запази този линк — тук ще видиш дали е казал/а ДА и кога/къде иска да излезете.',
    btn_create_another: '+ Създай още една',
    share_text_romantic: 'Имам нещо специално за теб... 💌',
    share_text_friendly: 'Хей! Имам покана за теб 🎉',

    /* --- Auth & Dashboard --- */
    nav_login: 'Вход',
    nav_register: 'Регистрация',
    nav_dashboard: 'Моите покани 📊',
    nav_logout: 'Изход',
    auth_username: 'Потребителско име',
    auth_password: 'Парола',
    auth_login_btn: 'Влез в профила',
    auth_register_btn: 'Създай профил',
    auth_no_account: 'Нямаш профил? Регистрирай се',
    auth_have_account: 'Вече имаш профил? Влез тук',
    dashboard_title: 'Моите изпратени покани 💌',
    dashboard_no_invites: 'Все още не си изпратил покани.',
    table_recipient: 'Получател',
    table_kind: 'Тип покана',
    table_status: 'Статус',
    table_response: 'Отговор',
    status_pending: 'Очаква отговор ⏳',
    status_accepted: 'Приета! 🎉',
    status_rejected: 'Отказана 😢',
    details: 'Детайли',
    link: 'Линк',
    copy_link: 'Копирай поканата',
    copy_result_link: 'Копирай отговора',

    /* --- Media inputs --- */
    photo_change: 'Смени снимка',
    photo_add: '📷 Качи снимка',
    remove: 'Махни',
    voice_stop: 'Стоп',
    voice_record_again: '🎤 Запиши наново',
    voice_record: '🎤 Запиши глас',
    voice_upload: '📎 Качи аудио',
    voice_no_mic: 'Няма достъп до микрофона 🎤',

    /* --- Invite page --- */
    loading: 'Зареждам поканата...',
    audio_listen: '🎤 Чуй съобщението ми:',
    from_badge: 'Покана от',
    ask_romantic: ({ who }) => `Искаш ли да излезеш с мен на среща${who}? 🥺`,
    ask_friendly: ({ who }) => `Искаш ли да излезем заедно${who}? 🥺`,
    btn_yes: 'ДА! 💖',
    dodge_counter: ({ n }) => `Опити да избягаш от срещата: ${n} 😂`,
    dodge_hint: '(опитай се да натиснеш „Не“ 😉)',
    no_teases: [
      'Не',
      'Сигурен/а ли си? 🥺',
      'Хайде де... 😢',
      'Опитай пак 😅',
      'Няма да стане 😜',
      'Хвани ме! 🏃',
      'Последен шанс 😬',
      'Кажи ДА 💘',
    ],
    no_teases_friendly_male: [
      'Не',
      'Слабак 😜',
      'Жена ти не те пуска ли? 🤫',
      'Давай пак, джентълмен 🤣',
      'Бирата изветрява! 🍺',
      'Цъкни ме де, мързел 😴',
      'Няма измъкване! ⚽',
      'Кажи ДА бе, пич! 😎',
    ],
    no_teases_friendly_female: [
      'Не',
      'Сигурна ли си? 💅',
      'Ама има скандални клюки! 🤫',
      'Шопингът няма да чака 🛍️',
      'Опитай пак, кукло 😅',
      'Коктейлите се стоплиха! 🥂',
      'Хвани ме де! 💃',
      'Кажи ДА! 💕',
    ],
    no_teases_friendly_other: [
      'Не',
      'Сигурен/а ли си? 🤔',
      'Ама ще е много забавно! 🥳',
      'Опитай пак 😅',
      'Няма да стане 😜',
      'Хвани ме! 🏃',
      'Последен шанс 😬',
      'Кажи ДА 🌟',
    ],
    yay_super: 'СУПЕР!',
    yay_romantic: 'Радвам се, че искаш да излезеш с мен!',
    yay_friendly: 'Радвам се, че ще излезем заедно!',
    btn_next_big: 'Давай нататък ➡️',
    when_title: 'Кога искаш да излезем?',
    when_pick_date: 'Избери дата',
    when_time_label: 'В колко часа',
    date_tease_1: 'Е баш тогава ли? Тогава няма да мога… 😕',
    date_tease_2: 'Бъзикам се, за теб винаги мога! 😏💘',
    activity_title: 'Как го чувстваш?',
    food_title: 'Каква храна ти се яде?',
    btn_next: 'Напред ➡️',
    btn_done: 'Готово! 💘',
    final_romantic_title: 'Това е среща! 😘',
    final_friendly_title: 'Договорихме се! 😎',
    final_ready_pre: ({ ready }) => `Бъди ${ready} на`,
    at_word: 'в',
    final_come_romantic: 'Идвам за тебе бейби 😘',
    final_come_friendly: 'Идвам да те взема! 🚗',
    recap_when: 'Кога',
    recap_what: 'Какво',
    recap_eat: 'Хапваме',
    recap_from: 'От',
    recap_with: 'Среща с',
    countdown_label: '⏳ Остават до срещата',
    cd_days: 'дни',
    cd_hours: 'ч',
    cd_min: 'мин',
    cd_sec: 'сек',
    countdown_now: '⏰ Време е! Не ме карай да чакам 😘',
    btn_cancel_date: 'Откажи срещата 🙈',
    cancel_msg: 'Тц, няма отказване! 😘💘',
    cancel_msg_friendly_male: 'Къде тръгна бе, мишка? Няма отказване! 🐭❌🍻',
    cancel_msg_friendly_female: 'Тц, няма отказване! Обличай се и идвам! 👗💄✨',
    cancel_msg_friendly_other: 'Сделката си е сделка! Няма бягане от купона! 😎❌',
    caution_friendly_male: '⚠️ Ако закъснееш, правиш 50 лицеви опори пред всички! 💪⏱️',
    caution_friendly_female: '⚠️ Времето тече, а ти още не си решила какво да облечеш! 👗⏰',
    caution_friendly_other: '⚠️ Часовникът тиктака, приготви се за приключения! ⏰✨',
    sent_to: ({ name }) => `✅ Отговорът ти е изпратен на ${name}!`,
    preview_banner: '👀 Режим Преглед — твоите тестови отговори няма да бъдат записани в базата данни.',
    create_own_invite: '✨ Искаш ли и ти да изпратиш покана? Създай я оттук! 💌',
    showcase_title: '💡 Виж какви забавни неща има в поканата! (Натисни за преглед)',
    showcase_hide: 'Скрий прегледа ▲',
    showcase_feature_1_title: '🏃 Бягащият бутон „НЕ“',
    showcase_feature_1_desc: 'Получателят не може да натисне „Не“ — бутонът постоянно бяга от пръста/курсора и накрая се предава, ставайки бутон „ДА! 💖“!',
    showcase_feature_2_title: '🗓️ Шеги с дата & час',
    showcase_feature_2_desc: 'Ако получателят избере конкретен ден или твърде ранна/късна среща, сайтът автоматично се шегува с него с изскачащи балончета.',
    showcase_feature_3_title: '📊 Проследяване на живо',
    showcase_feature_3_desc: 'В твоя Dashboard виждаш отговора в реално време, плюс статистика точно колко пъти получателят се е опитал да избяга с „Не“!',
    showcase_demo_dodge_counter: 'Опити за бягство: ',
    showcase_demo_accepted: 'Среща на: ',

    /* --- Results page --- */
    your_invite: '📊 Твоята покана',
    recipient_generic: 'Поканеният',
    waiting_title: 'Още чакаме отговор...',
    waiting_desc: ({ name }) => `${name} още не е отговорил/а. Тази страница ще се обнови сама. 🤞`,
    watching_live: 'Следя на живо...',
    said_yes: 'Каза ДА!',
    result_meeting_pre: 'Среща на',
    result_eat: 'Хапвате',
    dodges_result: ({ n }) => `🙈 Опита се да натисне „Не“ цели ${n} ${n === 1 ? 'път' : 'пъти'}!`,
    dodges_result_sub: '...но бутонът избяга всеки път 😂',
    dont_be_late: 'Не закъснявай! 😘',
    back_home: 'Към началото',
    create_new: '+ Създай нова покана',

    /* --- Not found --- */
    nf_title: 'Упс, няма такава страница',
    nf_desc: 'Може би линкът е счупен или поканата е изтекла.',
    nf_btn: 'Създай нова покана 💌',

    /* --- Data: labels & quips --- */
    activity_restaurant: 'На ресторант',
    activity_cinema: 'На кино',
    activity_walk: 'На разходка',
    activity_bowling: 'На боулинг',
    activity_beer: 'На по бира',
    activity_match: 'Гледане на мач',
    activity_gaming: 'Цъкане на PS5',
    activity_billiards: 'Билярд & игри',
    activity_gossip: 'Кафе & Клюки',
    activity_cocktails: 'Коктейли / Вино',
    activity_shopping: 'Шопинг терапия',
    activity_beauty: 'Спа & Разкрасяване',
    activity_escape: 'Настолни игри',
    activity_party: 'Концерт / Парти',
    
    food_sushi: 'Суши',
    food_pizza: 'Пица',
    food_burger: 'Бургер',
    food_pasta: 'Паста',
    food_bbq: 'Грил & месо',
    food_vegan: 'Веган',
    food_fries: 'Картофки с цаца',
    food_nuts: 'Ядки & Чипс',
    food_wings: 'Люти крилца',
    food_cupcake: 'Мъфини & Торти',
    food_croissant: 'Брънч / Кроасани',
    food_strawberries: 'Ягоди с шоколад',
    food_cheese: 'Плато сирена',

    quip_act_restaurant: 'Ресторант? Обличам се красиво — гледай да впечатлиш! ✨🍽️',
    quip_act_cinema: 'Кино? За да не говориш много ли? 🍿😂',
    quip_act_walk: 'Само разходка? Икономисваш ли? 😄 (майтап, идеално е!)',
    quip_act_bowling: 'Боулинг? Подготви се за загуба 🎳😎',
    quip_act_beer: 'Биричка? Първият рунд е от теб, да знаеш! 🍻',
    quip_act_match: 'Мач? Ще викаме ли по съдията или ще се правим на културни? ⚽📣',
    quip_act_gaming: 'FIFA/Mortal Kombat? Подготви се за пълно разглобяване! 🎮🔥',
    quip_act_billiards: 'Билярд? Подготви се за загуба 🎱😎',
    quip_act_gossip: 'Кафе и клюки? Приготви си ушите, имам да ти разказвам страшни неща... ☕🍿',
    quip_act_cocktails: 'Коктейли? Един коктейл никога не е достатъчен! 🥂💃',
    quip_act_shopping: 'Шопинг? Пази си кредитната карта, отиваме на лов! 🛍️👠',
    quip_act_beauty: 'Спа ден? Заслужили сме си малко глезене! 🧖‍♀️✨',
    quip_act_escape: 'Настолни игри? Да видим дали имаш логика или само късмет! 🎲🧠',
    quip_act_party: 'Парти? Време е за малко силна музика и луди танци! 🎵🕺',

    quip_food_sushi: 'Суши? Само не се прави на интересен/на с пръчиците 🥢😏',
    quip_food_pizza: 'Пица! Ама без ананас, нали? 🍍🚫😂',
    quip_food_burger: 'Бургер? Точно по вкуса ми 🍔🤤',
    quip_food_pasta: 'Паста? Романтично като в анимациите 🍝❤️',
    quip_food_bbq: 'Грил? Месце, обичам те 🍖🔥',
    quip_food_vegan: 'Веган? Уважавам, зелено е животът 🥗🌱',
    quip_food_fries: 'Картофки с цаца? Класика за бира! 🍟🍺',
    quip_food_nuts: 'Ядки и чипс? Перфектно за хрускане пред екрана! 🥜📺',
    quip_food_wings: 'Люти крилца? Вземи си вода, ще е люто! 🍗🔥',
    quip_food_cupcake: 'Сладки мъфини? Точно за сладки приказки! 🧁💖',
    quip_food_croissant: 'Брънч с кроасани? Много френско и изискано! 🥐🥖',
    quip_food_strawberries: 'Ягоди с шоколад? Еха, глезиш се! 🍓🍫',
    quip_food_cheese: 'Плато сирена? Върви идеално с чаша вино! 🧀🍷',

    time_prank_early: ['Толкова рано?! Аз по това време спя… 😴', 'Шегувам се, ставам и в 5 за теб! 🌅💘'],
    time_prank_late: ['Олеле, среднощни планове 😏🌙', 'Идеално, тъмното ни отива 😏✨'],
  },

  en: {
    /* --- Create page --- */
    create_title: 'Invite Me',
    create_subtitle: 'Create a super fun invitation and send the link to your special someone.',
    field_your_name: 'Your name',
    ph_your_name: 'e.g. Alex',
    field_recipient_name: "Their name (optional)",
    ph_recipient_name: 'e.g. Maria',
    field_kind: 'What kind of invite?',
    kind_romantic: '💕 Romantic',
    kind_friendly: '🎉 Friendly',
    field_recipient: 'Who are you sending it to?',
    gender_female: 'Woman',
    gender_male: 'Man',
    gender_other: 'Other',
    field_message: 'Personal message (optional)',
    ph_message: 'Something sweet, funny or mysterious...',
    field_photo: 'Your photo (optional)',
    field_voice: 'Voice message (optional)',
    err_name: 'Type your name 🙂',
    btn_creating: 'Creating... ✨',
    btn_create: 'Create the invite 💌',
    created_title: 'Done! 🎉',
    created_share_line: 'Send this link to your special someone:',
    btn_copy: 'Copy',
    btn_preview: '👀 See how it looks',
    btn_share: '📤 Share',
    result_link_title: '🔔 Link for you (for the answer):',
    result_link_desc: 'Save this link — here you will see if they said YES and when/where they want to go out.',
    btn_create_another: '+ Create another',
    share_text_romantic: 'I have something special for you... 💌',
    share_text_friendly: 'Hey! I have an invite for you 🎉',

    /* --- Auth & Dashboard --- */
    nav_login: 'Login',
    nav_register: 'Register',
    nav_dashboard: 'My Invites 📊',
    nav_logout: 'Logout',
    auth_username: 'Username',
    auth_password: 'Password',
    auth_login_btn: 'Login',
    auth_register_btn: 'Register',
    auth_no_account: "Don't have an account? Register",
    auth_have_account: 'Already have an account? Login',
    dashboard_title: 'My Sent Invitations 💌',
    dashboard_no_invites: "You haven't sent any invitations yet.",
    table_recipient: 'Recipient',
    table_kind: 'Kind',
    table_status: 'Status',
    table_response: 'Response',
    status_pending: 'Pending ⏳',
    status_accepted: 'Accepted! 🎉',
    status_rejected: 'Declined 😢',
    details: 'Details',
    link: 'Link',
    copy_link: 'Copy invite link',
    copy_result_link: 'Copy response link',

    /* --- Media inputs --- */
    photo_change: 'Change photo',
    photo_add: '📷 Add photo',
    remove: 'Remove',
    voice_stop: 'Stop',
    voice_record_again: '🎤 Record again',
    voice_record: '🎤 Record voice',
    voice_upload: '📎 Upload audio',
    voice_no_mic: 'No microphone access 🎤',

    /* --- Invite page --- */
    loading: 'Loading the invite...',
    audio_listen: '🎤 Listen to my message:',
    from_badge: 'Invitation from',
    ask_romantic: ({ who }) => `Will you go on a date with me${who}? 🥺`,
    ask_friendly: ({ who }) => `Want to hang out together${who}? 🥺`,
    btn_yes: 'YES! 💖',
    dodge_counter: ({ n }) => `Attempts to dodge the date: ${n} 😂`,
    dodge_hint: '(try to press “No” 😉)',
    no_teases: [
      'No',
      'Are you sure? 🥺',
      'Come on... 😢',
      'Try again 😅',
      "It won't work 😜",
      'Catch me! 🏃',
      'Last chance 😬',
      'Say YES 💘',
    ],
    no_teases_friendly_male: [
      'No',
      'Weakling 😜',
      'Wife won\'t let you? 🤫',
      'Try again, gentleman 🤣',
      'The beer is getting flat! 🍺',
      'Click me, lazy bones 😴',
      'No escape! ⚽',
      'Say YES, bro! 😎',
    ],
    no_teases_friendly_female: [
      'No',
      'Are you sure? 💅',
      'But there is scandal gossip! 🤫',
      'Shopping won\'t wait 🛍️',
      'Try again, doll 😅',
      'The cocktails are warm! 🥂',
      'Catch me! 💃',
      'Say YES! 💕',
    ],
    no_teases_friendly_other: [
      'No',
      'Are you sure? 🤔',
      'But it will be super fun! 🥳',
      'Try again 😅',
      'Won\'t work 😜',
      'Catch me! 🏃',
      'Last chance 😬',
      'Say YES 🌟',
    ],
    yay_super: 'AWESOME!',
    yay_romantic: "I'm so glad you want to go out with me!",
    yay_friendly: "I'm so glad we're hanging out!",
    btn_next_big: "Let's go ➡️",
    when_title: 'When do you want to go out?',
    when_pick_date: 'Pick a date',
    when_time_label: 'At what time',
    date_tease_1: "Exactly then? Hmm, I can't make it… 😕",
    date_tease_2: "Just kidding, for you I'm always free! 😏💘",
    activity_title: 'What are you feeling?',
    food_title: 'What food do you fancy?',
    btn_next: 'Next ➡️',
    btn_done: 'Done! 💘',
    final_romantic_title: "It's a date! 😘",
    final_friendly_title: "It's settled! 😎",
    final_ready_pre: () => 'Be ready on',
    at_word: 'at',
    final_come_romantic: "I'm coming for you baby 😘",
    final_come_friendly: "I'll come pick you up! 🚗",
    recap_when: 'When',
    recap_what: 'What',
    recap_eat: 'Eating',
    recap_from: 'From',
    recap_with: 'Date with',
    countdown_label: '⏳ Time left until the date',
    cd_days: 'days',
    cd_hours: 'h',
    cd_min: 'min',
    cd_sec: 'sec',
    countdown_now: "⏰ It's time! Don't keep me waiting 😘",
    btn_cancel_date: 'Cancel the date 🙈',
    cancel_msg: 'Nope, no cancelling! 😘💘',
    cancel_msg_friendly_male: 'Where are you going, mouse? No backing out! 🐭❌🍻',
    cancel_msg_friendly_female: 'Nope, no cancelling! Get dressed, I\'m coming! 👗💄✨',
    cancel_msg_friendly_other: 'A deal is a deal! No running away from the party! 😎❌',
    caution_friendly_male: '⚠️ If you are late, you do 50 pushups in front of everyone! 💪⏱️',
    caution_friendly_female: '⚠️ Time is ticking and you still haven\'t decided what to wear! 👗⏰',
    caution_friendly_other: '⚠️ The clock is ticking, get ready for adventures! ⏰✨',
    sent_to: ({ name }) => `✅ Your answer was sent to ${name}!`,
    preview_banner: '👀 Preview Mode — your test responses will not be saved to the database.',
    create_own_invite: '✨ Want to send an invitation yourself? Create it here! 💌',
    showcase_title: '💡 See what fun things are inside the invitation! (Click to preview)',
    showcase_hide: 'Hide preview ▲',
    showcase_feature_1_title: '🏃 The fleeing "NO" button',
    showcase_feature_1_desc: 'The recipient can never click "No" — the button constantly flees from their finger/cursor, and finally gives up, morphing into a "YES! 💖" button!',
    showcase_feature_2_title: '🗓️ Date & Time pranks',
    showcase_feature_2_desc: 'If the recipient chooses a specific day or a date that is too early/late, the website automatically teases them with funny speech bubbles.',
    showcase_feature_3_title: '📊 Live dashboard tracking',
    showcase_feature_3_desc: 'In your dashboard, you can see their answer in real-time, plus stats on how many times they tried to click "No"!',
    showcase_demo_dodge_counter: 'Attempts to dodge: ',
    showcase_demo_accepted: 'Date set for: ',

    /* --- Results page --- */
    your_invite: '📊 Your invitation',
    recipient_generic: 'They',
    waiting_title: "Still waiting for an answer...",
    waiting_desc: ({ name }) => `${name} hasn't answered yet. This page will refresh by itself. 🤞`,
    watching_live: 'Watching live...',
    said_yes: 'They said YES!',
    result_meeting_pre: 'Date on',
    result_eat: 'Eating',
    dodges_result: ({ n }) => `🙈 They tried to press “No” ${n} ${n === 1 ? 'time' : 'times'}!`,
    dodges_result_sub: '...but the button fled every time 😂',
    dont_be_late: "Don't be late! 😘",
    back_home: 'Back to start',
    create_new: '+ Create a new invite',

    /* --- Not found --- */
    nf_title: "Oops, no such page",
    nf_desc: 'Maybe the link is broken or the invite expired.',
    nf_btn: 'Create a new invite 💌',

    /* --- Data: labels & quips --- */
    activity_restaurant: 'Restaurant',
    activity_cinema: 'Cinema',
    activity_walk: 'A walk',
    activity_bowling: 'Bowling',
    activity_beer: 'For a beer',
    activity_match: 'Watch a match',
    activity_gaming: 'Play PS5',
    activity_billiards: 'Billiards & games',
    activity_gossip: 'Coffee & Gossip',
    activity_cocktails: 'Cocktails / Wine',
    activity_shopping: 'Shopping therapy',
    activity_beauty: 'Spa & Beauty',
    activity_escape: 'Boardgames',
    activity_party: 'Concert / Party',

    food_sushi: 'Sushi',
    food_pizza: 'Pizza',
    food_burger: 'Burger',
    food_pasta: 'Pasta',
    food_bbq: 'Grill & meat',
    food_vegan: 'Vegan',
    food_fries: 'Fries & sprats',
    food_nuts: 'Nuts & Chips',
    food_wings: 'Hot wings',
    food_cupcake: 'Muffins & Cakes',
    food_croissant: 'Brunch & Croissants',
    food_strawberries: 'Strawberries with chocolate',
    food_cheese: 'Cheese platter',

    quip_act_restaurant: "Restaurant? I'm dressing up — better impress me! ✨🍽️",
    quip_act_cinema: 'Cinema? So I talk less, huh? 🍿😂',
    quip_act_walk: 'Just a walk? Saving money? 😄 (kidding, it\'s perfect!)',
    quip_act_bowling: 'Bowling? Get ready to lose 🎳😎',
    quip_act_beer: 'Beer? First round is on you, just so you know! 🍻',
    quip_act_match: 'Match? Are we gonna yell at the ref or pretend to be polite? ⚽📣',
    quip_act_gaming: 'PS5? Get ready to get destroyed! 🎮🔥',
    quip_act_billiards: 'Billiards? Prepare to lose 🎱😎',
    quip_act_gossip: 'Coffee and gossip? Get your ears ready, I have stories... ☕🍿',
    quip_act_cocktails: 'Cocktails? One is never enough! 🥂💃',
    quip_act_shopping: 'Shopping? Save your credit card, we\'re going hunting! 🛍️👠',
    quip_act_beauty: 'Spa day? We\'ve earned some pampering! 🧖‍♀️✨',
    quip_act_escape: 'Boardgames? Let\'s see if you have logic or just luck! 🎲🧠',
    quip_act_party: 'Party? Time for loud music and crazy dancing! 🎵🕺',

    quip_food_sushi: "Sushi? Just don't show off with the chopsticks 🥢😏",
    quip_food_pizza: 'Pizza! But no pineapple, right? 🍍🚫😂',
    quip_food_burger: 'Burger? Just my taste 🍔🤤',
    quip_food_pasta: 'Pasta? Romantic like in the cartoons 🍝❤️',
    quip_food_bbq: 'Grill? Meat, I love you 🍖🔥',
    quip_food_vegan: 'Vegan? Respect, green is life 🥗🌱',
    quip_food_fries: 'Fries and sprats? Classic for beer! 🍟🍺',
    quip_food_nuts: 'Nuts and chips? Perfect for crunching! 🥜📺',
    quip_food_wings: 'Hot wings? Grab some water, it\'s gonna be hot! 🍗🔥',
    quip_food_cupcake: 'Muffins? Just for sweet talks! 🧁💖',
    quip_food_croissant: 'Brunch with croissants? Very French and fancy! 🥐🥖',
    quip_food_strawberries: 'Strawberries with chocolate? Wow, pampering yourself! 🍓🍫',
    quip_food_cheese: 'Cheese platter? Goes perfectly with a glass of wine! 🧀🍷',

    time_prank_early: ["So early?! I'm asleep then… 😴", "Just kidding, I'd get up at 5 for you! 🌅💘"],
    time_prank_late: ['Ooh, midnight plans 😏🌙', 'Perfect, the dark suits us 😏✨'],
  },
}

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('lang') || 'bg'
    } catch {
      return 'bg'
    }
  })

  const setLang = useCallback((l) => {
    try {
      localStorage.setItem('lang', l)
    } catch {
      /* ignore */
    }
    setLangState(l)
  }, [])

  const t = useCallback(
    (key, params) => {
      const v = STRINGS[lang]?.[key] ?? STRINGS.bg[key] ?? key
      return typeof v === 'function' ? v(params || {}) : v
    },
    [lang]
  )

  return (
    <LangContext.Provider value={{ lang, setLang, toggle: () => setLang(lang === 'bg' ? 'en' : 'bg'), t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}

// Gender-aware "ready" word; English has no gendered form.
export function readyWord(gender, lang) {
  if (lang !== 'bg') return 'ready'
  return gender === 'female' ? 'готова' : gender === 'male' ? 'готов' : 'готов/а'
}

// Localized pretty date, e.g. "петък, 6 юни" / "Friday, 6 June".
export function prettyDate(iso, lang) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  if (isNaN(d)) return iso
  return d.toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

// Two-step prank for extreme hours; null for normal times.
export function timePrank(time, t) {
  if (!time) return null
  const hour = parseInt(time.slice(0, 2), 10)
  if (Number.isNaN(hour)) return null
  if (hour < 9) return t('time_prank_early')
  if (hour >= 23) return t('time_prank_late')
  return null
}

// The floating language switch — a flag toggle (active flag highlighted).
const LANGS = [
  { code: 'bg', flag: '🇧🇬', label: 'Български' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
]

export function LanguageToggle() {
  const { lang, setLang } = useLang()
  return (
    <div className="fixed right-3 top-3 z-[60] flex items-center gap-1 rounded-full border border-white/20 bg-white/10 p-1 backdrop-blur">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          aria-label={l.label}
          aria-pressed={lang === l.code}
          title={l.label}
          className={`rounded-full px-2.5 py-1 text-lg leading-none transition ${
            lang === l.code
              ? 'bg-white/25 shadow-[0_0_0_2px_rgba(255,91,138,.6)]'
              : 'opacity-50 hover:opacity-90'
          }`}
        >
          {l.flag}
        </button>
      ))}
    </div>
  )
}
