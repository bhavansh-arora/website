import React, { useState, useEffect } from "react";
import { auth, googleAuthProvider } from "../firebase";
import { toast } from "react-toastify";
import { Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Login({ history }) {
  const [email, setEmail] = useState("bhavansharora21@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  let dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));
  //   const [password, password] = useState()
  useEffect(() => {
    if (user && user.token) {
      toast.warning("You are already logged in ...");
      history.push("/"); // you can push it anywhere where we want
    }
  }, [user]);

  const submitLoginForm = async (e) => {
    e.preventDefault();
    // console.log(email, password);
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      // console.log(result);
      setLoading(true);
      // toast.success(`Loading`);
      const { user } = result;
      // console.log(user);
      const idTokenResult = await user.getIdTokenResult();
      dispatch({
        type: "LOGGED_IN_USER",
        payload: {
          email: user.email,
          token: idTokenResult.token,
        },
      });
      toast.success(`Logged In Successfully ${email}`);
      history.push("/");
    } catch (e) {
      console.log(e.message);
      toast.error(e.message);
      setLoading(false);
    }
  };

  const loginForm = () => (
    <form>
      <br />

      <input
        type="password"
        className="form-control"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
      />
      <br />

      <Button
        onClick={submitLoginForm}
        type="primary"
        shape="round"
        size="middle"
        block
        className="mb-3"
        icon={<MailOutlined />}
        disabled={!email}
      >
        Login with Email
      </Button>
    </form>
  );

  return (
    <div className="conatiner p-5">
      <div className="row">
        <div className="col-md-4 offset-md-4">
          {loading ? <h4 className="danger">Loading ...</h4> : <h4>Loading</h4>}

          {loginForm()}

          <Link to="/forgot/password" className="float-right text-danger">
            <b>Forgot Password ?</b>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
