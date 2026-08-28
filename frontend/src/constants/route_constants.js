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

    //// USER PERMISSIONS ROUTES ////
    GET_IS_VERIFIED_USER: `${getBaseUrl()}/GETisVerifiedUser`,
    GET_IS_ADMIN: `${getBaseUrl()}/GETisAdmin`,
    CURRENT_USER: `${getBaseUrl()}/current_user`,
    LOGOUT: `${getBaseUrl()}/logout`,
    SIGN_IN: `${getBaseUrl()}/auth/google`,

    //// TRAITS ROUTES ////
    GET_ALL_TRAITS: `${getBaseUrl()}/GETallCharacterTraits`,

    //// ADMIN ROUTES ////
    GET_TABLE_DRAFT_INFORMATION: `${getBaseUrl()}/GETtableDraftInformation`,
    GET_TABLE_INSIGHTS: `${getBaseUrl()}/GETtableInsights`,
    GET_TABLE_TRAITS: `${getBaseUrl()}/GETtableTraits`,
    GET_ID_NAME_MAPPING: `${getBaseUrl()}/GETIDNameMapping`,
    // Update (PUT)
    UPDATE_TRAITS_TABLE_ROW: `${getBaseUrl()}/PUTTraitsTableRow`,
    UPDATE_STRENGTH_LEVEL: `${getBaseUrl()}/PUTStrengthLevel`,
    UPDATE_INSIGHTS_TABLE_ROW: `${getBaseUrl()}/PUTInsightsTableRow`,
    UPDATE_DRAFT_INFO_TABLE_ROW: `${getBaseUrl()}/PUTDraftInfoTableRow`,
    UPDATE_TIER_LIST_TABLE_ROW: `${getBaseUrl()}/PUTTierListTableRow`,
    UPDATE_TIER_LIST_WHOLE_TABLE: `${getBaseUrl()}/PUTTierListWholeTable`,
    // Create (POST)
    POST_TRAITS_TABLE_ROW: `${getBaseUrl()}/POSTTraitsTableRow`,
    POST_INSIGHTS_TABLE_ROW: `${getBaseUrl()}/POSTInsightsTableRow`,
    POST_DRAFT_INFO_TABLE_ROW: `${getBaseUrl()}/POSTDraftInfoTableRow`,
    POST_TIER_LIST_TABLE_ROW: `${getBaseUrl()}/POSTTierListTableRow`,
    POST_CHARACTER_TABLE_ROW: `${getBaseUrl()}/POSTCharacterTableRow`,
    POST_MOVE_TABLE_ROW: `${getBaseUrl()}/POSTMoveTableRow`,
};