import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import classes from "./AuthForm.module.css";
import { userLogin } from "../../store/auth-actions";

const AuthForm = () => {
  const dispatch = useDispatch();

  const history = useHistory();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const isLogin = useSelector((state) => state.auth.isAuthenticated);

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    const formData = {
      enteredEmail,
      enteredPassword,
      action: "signup",
    };

    // optional: Add validation
    if (isLogin) {
      formData.action = "login";
    }

    dispatch(userLogin(formData));
  };

  useEffect(() => {
    if (isLogin) {
      history.replace("/");
    }
  }, [isLogin]);

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
