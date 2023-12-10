
import moment from "moment";

export const profileColors = [
    "#E95F56",
    "#C490D1",
    "#897E95",
    "#A6AB95",
    "#E46000",
    "#1090D8",
    "#E86D8A",
    "#1F7551",
    "#9DC2B7",
    "#FFE177",
    "#A9D2FD",
    "#FFCDA5",
    "#4AAC67",
    "#FFE5A5",
    "#CD413C",
    '#e86af0',
    '#ff00c1',
    '#00fff9',
    '#afffed',
    '#ff5500'
];

export const DELETED_FOR_ME = "DELETED_FOR_ME";
export const DELETED_FOR_EVERYONE = "DELETED_FOR_EVERYONE";
export const STORAGE_KEY = "MyTradingChat_Storage_Key";

//Membership
export const CHAT_MONTHLY = "CHAT_MONTHLY";
export const CHAT_YEARLY = "CHAT_YEARLY";
export const CHAT_SIXMONTH = "CHAT_SIXMONTH";

export const PAYMENT_CANCEL = "PAYMENT_CANCEL";

export const COPYRIGHT = `Copyright ${(new Date()).getFullYear()}, Mytrading.chat All Rights Reserved.`

export const formatDate = (date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) {
        return "now";
    }

    if (diff < 3600000) {
        return `${Math.round(diff / 60000)} min ago`;
    }

    if (diff < 86400000) {
        return moment(date).format("h:mm A");
    }

    return moment(date).format("MM/DD/YY");
};

export const wrapEmojisInHtmlTag = (messageText) => {
    const regexEmoji = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu; // regex to match all Unicode emojis
    return messageText.replace(regexEmoji, (match) => {
        return `<span style="font-size:1.5em;margin:0 2px;position:relative;top:2px">${match}</span>`;
    });
};