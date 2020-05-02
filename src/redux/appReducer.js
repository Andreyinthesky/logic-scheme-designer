import { SHOW_EXPORT_FORM, SHOW_LOAD_FORM, HIDE_EXPORT_FORM, HIDE_LOAD_FORM, SHOW_NOTIFICATION, HIDE_NOTIFICATION } from "./actionTypes";


const initialState = {
  nextNotificationId: 1,
  notifications: [],
  showExportForm: false,
  showLoadForm: true,
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_EXPORT_FORM:
      return { ...state, showExportForm: true };
    case SHOW_LOAD_FORM:
      return { ...state, showLoadForm: true };
    case HIDE_EXPORT_FORM:
      return { ...state, showExportForm: false };
    case HIDE_LOAD_FORM:
      return { ...state, showLoadForm: false };
    case SHOW_NOTIFICATION: {
      const notification = action.payload;
      notification.id = state.nextNotificationId;
      return {
        ...state,
        notifications: [...state.notifications, notification],
        nextNotificationId: ++state.nextNotificationId
      };
    }
    case HIDE_NOTIFICATION: {
      const id = action.payload;
      const notifications = state.notifications.filter(n => n.id !== id);
      return {
        ...state,
        notifications,
      };
    }
    default: return state;
  }
};