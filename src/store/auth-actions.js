import { authSliceActions } from "./auth-slice";

let logoutTimer;

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("token");
  const storedExpirationDate = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationTime");
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime,
  };
};

export const userLogin = (userData) => {
  let url =
    "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCSGBPZ7sYN4g6AoSCoG3I3HROtbiCFwDA";
  if (userData.action == "login") {
    url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCSGBPZ7sYN4g6AoSCoG3I3HROtbiCFwDA";
  }
  return async (dispatch) => {
    const loginUser = async () => {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          email: userData.enteredEmail,
          password: userData.enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.error(data);
        let errorMessage = "Authentication failed!";
        throw new Error(errorMessage);
      }

      return data;
    };

    try {
      const data = await loginUser();
      const expirationTime = new Date(
        new Date().getTime() + +data.expiresIn * 1000
      );
      const loginResult = {
        token: data.idToken,
        expirationTime: expirationTime.toISOString(),
      };
      //add to local store
      localStorage.setItem("token", loginResult.token);
      localStorage.setItem("expirationTime", loginResult.expirationTime);
      //update state
      dispatch(authSliceActions.login(loginResult));

      const remainingTime = calculateRemainingTime(expirationTime);
      console.info("remainingTime = " + remainingTime);
      //   logoutTimer = setTimeout(
      //     dispatch(authSliceActions.logout()),
      //     remainingTime
      //   );
    } catch (err) {
      alert(err.message);
    }
  };
};
