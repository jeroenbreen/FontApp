import { ADD_FONT } from "./../../types";
import Font from './Font';

const initialState = {
    all: [],
    // byIds: {}
};

export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_FONT: {
            return {
                ...state,
                all: state.all.concat(new Font(action.payload))
            }
        }
        default:
            return state;
    }
}
