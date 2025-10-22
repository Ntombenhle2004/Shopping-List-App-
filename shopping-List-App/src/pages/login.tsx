import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../Reduxhooks";





export default function Login() {const email = useAppSelector((state) => state.login.email);
const dispatch = useAppDispatch();
  return (
    <div>

        email: {email}ijkj88i8ij
   </div>
  );
}
