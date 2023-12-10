import layout from "./layoutReducer";
import chat from "@/components/partials/app/chat/store";
import stocks from "@/components/partials/app/stocks/store";
// import todo from "@/components/partials/app/todo/store";
// import email from "@/components/partials/app/email/store";
// import project from "@/components/partials/app/projects/store";
// import kanban from "@/components/partials/app/kanban/store";
// import calendar from "@/components/partials/app/calender/store";
import auth from "@/components/partials/auth/store";


const rootReducer = {
  layout,
  auth,
  chat,
  stocks,
};
export default rootReducer;
