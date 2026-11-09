import { createContext, useContext } from "react";
import { Model } from "../types";

export const Context = createContext<Model>(null!);

export const useApp = () => useContext(Context);
