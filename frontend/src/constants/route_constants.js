const getBaseUrl = () => {
    if (window.location.hostname === 'localhost') {
        return 'http://localhost:3001';
    }
    return '';
};

export const routes = {
    //// DRAFT ROUTES ////
    GET_ALL_DRAFT_INFO: `${getBaseUrl()}/GETallDraftInfo`,
    GET_ALL_CHARACTERS_AND_MOVES: `${getBaseUrl()}/GETallCharactersAndMoves`,

    //// TIER LIST ROUTES ////
    GET_TIER_LIST: `${getBaseUrl()}/GETtierList`,
    POST_TIER_LIST_ENTRY: `${getBaseUrl()}/POSTtierListEntry`,

    //// USER PERMISSIONS ROUTES ////
    GET_IS_VERIFIED_USER: `${getBaseUrl()}/GETisVerifiedUser`,
    GET_IS_ADMIN: `${getBaseUrl()}/GETisAdmin`,
    CURRENT_USER: `${getBaseUrl()}/current_user`,
    LOGOUT: `${getBaseUrl()}/logout`,
    SIGN_IN: `${getBaseUrl()}/auth/google`,

    //// TRAITS ROUTES ////
    GET_ALL_TRAITS: `${getBaseUrl()}/GETallCharacterTraits`,
    PUT_CHARACTER_TRAIT: `${getBaseUrl()}/PUTCharacterTrait`,

    //// ADMIN ROUTES ////
    GET_TABLE_DRAFT_INFORMATION: `${getBaseUrl()}/GETtableDraftInformation`,
    GET_TABLE_INSIGHTS: `${getBaseUrl()}/GETtableInsights`,
    GET_TABLE_TRAITS: `${getBaseUrl()}/GETtableTraits`,
    GET_ID_NAME_MAPPING: `${getBaseUrl()}/GETIDNameMapping`,
};