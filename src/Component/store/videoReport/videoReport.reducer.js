import * as ActionType from "./videoReport.type";

const initialState = {
    videoReport: [],
};


export const videoReportReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.GET_VIDEO_REPORT:
            console.log("action.payload--reducer", action.payload);

            return {
                ...state,
                videoReport: action.payload,
            };


        case ActionType.DELETE_VIDEO_REPORT:
            console.log("action.payload---delete", action.payload);
            return {
                ...state,
                videoReport: state.videoReport.filter(
                    (data) => data._id !== action.payload
                ),
            };

        case ActionType.UPDATE_VIDEO_REPORT:
            console.log("action.payloa--update video-report", action.payload);

            return {
                ...state,
                videoReport: state.videoReport.filter((redeem) => redeem._id !== action?.payload),
            };

        default:
            return state;
    }
};