const getBaseUrl = () => {
    if (window.location.hostname === 'localhost') {
        return 'http://localhost:3001';
    }
    return '';
};

export const routes = {
    //// DRAFT ROUTES ////
    GET_ALL_DRAFT_INFO: `${getBaseUrl()}/GETallDraftInfo`,

    //// DRAFT ROOM ROUTES ////
    POST_ROOMS: `${getBaseUrl()}/POSTrooms`,
    GET_ROOMS: `${getBaseUrl()}/GETrooms`,
    GET_ROOM_INFO: `${getBaseUrl()}/GETrooms/`,

    //// AI ROUTES ////
    GET_RUN_A_STAR_ALGORITHM: `${getBaseUrl()}/GETrunAStarAlgorithm`,
    GET_RATE_COMP: `${getBaseUrl()}/GETrateComp`,

    //// INSIGHTS ROUTES ////
    GET_ALL_INSIGHTS: `${getBaseUrl()}/GETallInsights`,
    
    //// PRO MATCHES ROUTES ////
    GET_ALL_SETS: `${getBaseUrl()}/GETallSets`,
    GET_ALL_EVENTS: `${getBaseUrl()}/GETallEvents`,
    GET_ALL_TEAMS: `${getBaseUrl()}/GETallTeams`,
    GET_ALL_PLAYERS: `${getBaseUrl()}/GETallPlayers`,
    GET_ALL_CHARACTERS_AND_MOVES: `${getBaseUrl()}/GETallCharactersAndMoves`,
    POST_EVENT: `${getBaseUrl()}/POSTevent`,
    POST_TEAM: `${getBaseUrl()}/POSTteam`,
    POST_PLAYER: `${getBaseUrl()}/POSTplayer`,
    POST_SET: `${getBaseUrl()}/POSTset`,

    //// STATS ROUTES ////
    GET_DRAFT_STATS: `${getBaseUrl()}/GETdraftStats`,
    GET_OVERALL_BATTLE_STATS: `${getBaseUrl()}/GEToverallBattleStats`,
    GET_INDIVIDUAL_BATTLE_STATS: `${getBaseUrl()}/GETindividualBattleStats`,
    
    //// TIER LIST ROUTES ////
    GET_TIER_LIST: `${getBaseUrl()}/GETtierList`,
    POST_TIER_LIST_ENTRY: `${getBaseUrl()}/POSTtierListEntry`,

    //// USER PERMISSIONS ROUTES ////
    GET_IS_VERIFIED_USER: `${getBaseUrl()}/GETisVerifiedUser`,
    GET_IS_ADMIN: `${getBaseUrl()}/GETisAdmin`,
    CURRENT_USER: `${getBaseUrl()}/current_user`,
    LOGOUT: `${getBaseUrl()}/logout`,
    SIGN_IN: `${getBaseUrl()}/auth/google`,

    //// ATTRIBUTES ROUTES ////
    GET_ALL_ATTRIBUTES: `${getBaseUrl()}/GETallCharacterAttributes`,
    GET_SINGLE_ATTRIBUTES: `${getBaseUrl()}/GETsingleCharacterAttributes`,
    PUT_CHARACTER_ATTRIBUTE: `${getBaseUrl()}/PUTCharacterAttribute`,
};