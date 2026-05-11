import { useColorScheme } from "react-native";
import { LIGHT, DARK } from "@/constants/theme";

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === "dark" ? DARK : LIGHT;
}
