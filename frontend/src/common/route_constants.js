const getBaseUrl = () => {
    if (window.location.hostname === 'localhost') {
        return 'http://localhost:3001';
    }
    return '';
};

export const routes = {
    GET_ALL_DRAFT_INFO: `${getBaseUrl()}/GETallDraftInfo`,
    GET_ALL_ATTRIBUTES: `${getBaseUrl()}/GETallCharacterAttributes`,
    GET_SINGLE_ATTRIBUTES: `${getBaseUrl()}/GETsingleCharacterAttributes`,
    PUT_CHARACTER_ATTRIBUTES: `${getBaseUrl()}/PUTCharacterAttributes`,
    GET_RUN_A_STAR_ALGORITHM: `${getBaseUrl()}/GETrunAStarAlgorithm`,
    GET_ALL_COMPS: `${getBaseUrl()}/GETallComps`,
    GET_ALL_EVENTS: `${getBaseUrl()}/GETallEvents`,
    GET_ALL_TEAMS: `${getBaseUrl()}/GETallTeams`,
    GET_ALL_PLAYERS: `${getBaseUrl()}/GETallPlayers`,
    GET_ALL_CHARACTERS_AND_MOVES: `${getBaseUrl()}/GETallCharactersAndMoves`,
    POST_EVENT: `${getBaseUrl()}/POSTevent`,
    POST_TEAM: `${getBaseUrl()}/POSTteam`,
    POST_PLAYER: `${getBaseUrl()}/POSTplayer`,
    POST_SET: `${getBaseUrl()}/POSTset`,
    POST_ROOMS: `${getBaseUrl()}/POSTrooms`,
    GET_ROOMS: `${getBaseUrl()}/GETrooms`,
    GET_ROOM_INFO: `${getBaseUrl()}/GETrooms/`,
    GET_CHARACTER_STATS: `${getBaseUrl()}/GETcharacterStats`,
    GET_OVERALL_BATTLE_STATS: `${getBaseUrl()}/GEToverallBattleStats`,
    GET_INDIVIDUAL_BATTLE_STATS: `${getBaseUrl()}/GETindividualBattleStats`,
    GET_RATE_COMP: `${getBaseUrl()}/GETrateComp`,
    GET_TIER_LIST: `${getBaseUrl()}/GETtierList`,
    POST_TIER_LIST_ENTRY: `${getBaseUrl()}/POSTtierListEntry`,
    GET_IS_VERIFIED_USER: `${getBaseUrl()}/GETisVerifiedUser`,
    GET_IS_ADMIN: `${getBaseUrl()}/GETisAdmin`,
    CURRENT_USER: `${getBaseUrl()}/current_user`,
    LOGOUT: `${getBaseUrl()}/logout`,
    SIGN_IN: `${getBaseUrl()}/auth/google`
};