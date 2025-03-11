import { useSelector } from "react-redux";
import lang from "../constants/lang";

export const useTranslation = () => {
  const langSelected = useSelector(state => state.theme.lang);
  return lang[langSelected] || lang.esp;
};