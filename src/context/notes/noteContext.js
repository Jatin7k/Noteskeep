import { createContext } from "react";


//The Context API can be used to share data with multiple components, without having to pass data through props manually. Any state inside a context will become accessible to every component of the React Application

const noteContext = createContext();

export default noteContext;