import { defineStore } from 'pinia'

const useAuthenticationStore = defineStore('authentication', {
    state: () => ({ accessToken: null, refreshToken: null }),
    getters: {
        getAccessAndRefreshTokens() {
            return {
                accessToken: this.accessToken,
                refreshToken: this.refreshToken
            }
        },
    },
    actions: {
        setAccessAndRefreshTokens(accessToken, refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        },
        getBadResponse(){
            const myBlob = new Blob();
            const myOptions = { status: 400, statusText: "Something went wrong while trying to obtain a new access token!" };
            const response = new Response(myBlob, myOptions);

            return response;
        },
        async makeRequest(method, headers, url, body) {
            try {
                if (this.accessToken === null || this.refreshToken === null) {
                    return this.getBadResponse();
                }

                const response = await fetch(url, {
                    method: method,
                    headers: {
                        ...headers,
                        Authorization: `Bearer ${this.accessToken}`
                    },
                    body: JSON.stringify(body),
                });

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

                    return await this.makeRequest(method, headers, url, body);
                } 

                return this.getBadResponse();
            }
        },
        async getNewAccessToken(){
            try {
                const response = await fetch('auth/token/refresh/', {
                    method: 'POST',
                    headers: {
                        "Accept":"application/json", 
                        "Content-Type":"application/json"
                    },
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