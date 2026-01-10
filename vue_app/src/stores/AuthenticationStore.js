import { defineStore } from 'pinia'
import { setJWTTokens, getJWTTokens } from '../localStorageAPI';

const useAuthenticationStore = defineStore('authentication', {
    state: () => ({ accessToken: null, refreshToken: null }),
    getters: {
        getAccessAndRefreshTokens() {
            return {
                accessToken: this.accessToken,
                refreshToken: this.refreshToken
            }
        },
        getHeaders(){
            return {
                "Accept":"application/json", 
                "Content-Type":"application/json"
            }
        }
    },
    actions: {
        setAccessAndRefreshTokens(accessToken, refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;

            setJWTTokens(this.accessToken, this.refreshToken)
        },
        getBadResponse(){
            const myBlob = new Blob();
            const myOptions = { status: 400, statusText: "Something went wrong while trying to obtain a new access token!" };
            const response = new Response(myBlob, myOptions);
            return response;
        },
        async obtainJWTTokensFromLocalStorage(){
            const { accessToken, refreshToken } = getJWTTokens();
            this.setAccessAndRefreshTokens(accessToken, refreshToken);
        },
        async makeFinalRequest(method, url, body){
            await this.obtainJWTTokensFromLocalStorage();

            try {
                if (this.accessToken === null || this.refreshToken === null) {
                    return this.getBadResponse();
                }
                
                let response = null;

                console.log(`Making FINALLL ${method} request to ${url}`)

                // GET requests in fetch cannot have a body (else they throw an error),
                // so have to add a if-else statement to deal with this case
                if (method !== 'GET'){
                    response = await fetch(url, {
                        method: method,
                        headers: {
                            ...this.getHeaders,
                            Authorization: `Bearer ${this.accessToken}`
                        },
                        body: JSON.stringify(body),
                    });
                } else {
                    response = await fetch(url, {
                        method: method,
                        headers: {
                            ...this.getHeaders,
                            Authorization: `Bearer ${this.accessToken}`
                        }
                    })
                }

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                console.log("Request sent successfully!");

                return response;
            } catch (error) {
                console.error("Error while making request ", error.message);
                return this.getBadResponse();
            }
        },
        async makeRequest(method, url, body) {
            await this.obtainJWTTokensFromLocalStorage();

            try {
                if (this.accessToken === null || this.refreshToken === null) {
                    return this.getBadResponse();
                }
                
                let response = null;

                console.log(`Making ${method} request to ${url}`)

                // GET requests in fetch cannot have a body (else they throw an error),
                // so have to add a if-else statement to deal with this case
                if (method !== 'GET'){
                    response = await fetch(url, {
                        method: method,
                        headers: {
                            ...this.getHeaders,
                            Authorization: `Bearer ${this.accessToken}`
                        },
                        body: JSON.stringify(body),
                    });
                } else {
                    response = await fetch(url, {
                        method: method,
                        headers: {
                            ...this.getHeaders,
                            Authorization: `Bearer ${this.accessToken}`
                        }
                    })
                }

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                console.log("Request sent successfully!");

                return response;
            } catch (error) {
                console.error("Error while using existing access token ", error.message, "\nGoing to try requesting a new one!");
                const newAccessTokenObtainingAttemptResponse = await this.getNewAccessToken();

                if (newAccessTokenObtainingAttemptResponse.ok) {
                    const result = await newAccessTokenObtainingAttemptResponse.json();
                    this.accessToken = result.access;

                    setJWTTokens(this.accessToken, this.refreshToken);

                    return await this.makeFinalRequest(method, url, body);
                } 

                return this.getBadResponse();
            }
        },
        async getNewAccessToken(){
            try {
                const response = await fetch('auth/token/refresh/', {
                    method: 'POST',
                    headers: this.getHeaders,
                    body: JSON.stringify({ refresh: this.refreshToken }),
                });

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`);
                }

                console.log("Request for new access token sent AND received successfully!");

                return response;
            } catch (error) {
                console.error("Something went wrong while trying to obtain a new access token: ", error.message);
                return this.getBadResponse();
            }
        }
    },
})

export {
    useAuthenticationStore
}