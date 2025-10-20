import * as ActionType from "./currency.type";

const initialState = {
  currency: [],
  defaultCurrency: []
};

export const currencyReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_CURRENCY:
      return {
        ...state,
        currency: action.payload,
      };

    case ActionType.GET_DEFAULT_CURRENCY:
      return {
        ...state,
        defaultCurrency: action.payload,
      };

    case ActionType.CREATE_CURRENCY:
      const currentCurrency = Array.isArray(state.currency)
        ? state.currency
        : [];
      const updatedCurrency = [action.payload, ...currentCurrency].map((item) => item);
      return {
        ...state,
        currency: updatedCurrency,
      };

    case ActionType.UPDATE_CURRENCY:
      return {
        ...state,
        currency: state.currency.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };

    case ActionType.DELETE_CURRENCY:
      return {
        ...state,
        currency: state.currency.filter(
          (data) => data._id !== action.payload
        ),
      };

    case ActionType.DEFAULT_CURRENCY:
      return {
        ...state,
        currency: state.currency.map((data) =>
          data._id === action.payload.id ? action.payload.data : data
        ),
      };

    default:
      return state;
  }
};
