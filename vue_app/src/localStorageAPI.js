function setJWTTokens(accessToken, refreshToken){
    localStorage.setItem("access-token", accessToken);
    localStorage.setItem("refresh-token", refreshToken);
}

function getJWTTokens(){
    return {
        accessToken: localStorage.getItem("access-token"),
        refreshToken: localStorage.getItem("refresh-token")
    }
}

export {
    setJWTTokens,
    getJWTTokens
}