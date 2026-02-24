import { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Toast() {
  const { toast } = useContext(AppContext);
  return toast ? <div className="toast show">{toast}</div> : null;
}
