const global = {
    video_id: "", 
    video_analysis: [], 
    google_client_id: "714167032010-jse8uftnqqmuetruvc17oerjl06836s8.apps.googleusercontent.com", 
    microsoft_client_id: "e556e817-dbc5-4dac-9ab5-6038e2ca68b8", 

    colors: [
        "#cd5c5c", "#008db8", "#fa8072", "#800080", "#ffff00", 
        "#333333", "#000080", "#41ab5d", "#b22222", "#66e0ff", 
        "#b8860b", "#0000ff", "#7fff00", "#adff2f", "#001f3f", 
        "#F012BE", "#999999", "#66cdaa", "#ffb31a", "#2e008b", 
        "#a0522d", "#85144b", "#3D9970", "#e6194b", "#00c7ff", 
        "#4682b4", "#ff6347", "#daa520", "#afeeee", "#2f4f4f", 
        "#add8e6", "#a52a2a", "#0074D9", "#7FDBFF", 
        "#111111", "#AAAAAA", "#DDDDDD", "#e9967a", "#39CCCC", 
        "#2ECC40", "#01FF70", "#FFDC00", "#FF851B", "#FF4136", 
        "#c22d63", "#b0e0e6", "#8b0000", "#800000", "#ad0087", 
        "#67007c", "#4b0082", "#0000cd", "#4169e1", "#6495ed", 
        "#87cefa", "#98fb98", "#7fffd4", "#5f9ea0", "#228b22", 
        "#006400", "#008000", "#32cd32", "#9acd32", "#ffd700", 
        "#bc8f8f", "#dc143c", "#ff0000", "#ff7f50", "#f08080", 
        "#cd5c5c", "#a52a2a", "#800000", "#660000", "#4c0000", 
        "#330000", "#1a0000", "#000000", "#191919", "#4d4d4d", 
        "#666666", "#7f7f7f", "#b2b2b2", "#cccccc", "#e5e5e5",
        "#ffffcc", "#ffe680", "#ffd24d", "#a1d99b", "#004c6d",
        "#73d2a8", "#2aa13f"
    ],

    getToken: () => {
        let token = window.localStorage.getItem('access_token');
        let now = new Date();
        if (token) {
            token = JSON.parse(token)
        }
        if (token && token.expired > now.getTime()) {
            return token.token;
        } else {
            global.setToken(null);
            return null;
            // return "12345";
        }
    },
    
    setToken: (token) => {
        if (token !== null) {
            let now = new Date();
            let date = now.getTime() + 24 * 3600 * 1000;
            let accToken = {token: token, expired: new Date(date).getTime()}
            window.localStorage.setItem('access_token', JSON.stringify(accToken));
        } else {
            window.localStorage.setItem('access_token', null);
        }
    },

    checkToken: () => {
        const token = global.getToken();
        if (token) {

        } else if (window.location.pathname != "/login") {
            window.location.pathname = "/login";
        }
    }, 

    getUrlQuery: (key) => {
        let searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(key);
    },

    readSharedId: () => {
        let ids = global.getUrlQuery("id")?.replaceAll("[", "");
        ids = ids?.replaceAll("]", "");
        let tempIds = ids?.split(",");
        if (tempIds) {
            return tempIds;
        } else {
            return null;
        }
    },
}

export default global;