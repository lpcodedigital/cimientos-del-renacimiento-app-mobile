/// <reference types="react-native-css/types" />

declare module "*.css";

declare module "*.png" {
  import type { ImageSourcePropType } from "react-native";
  const source: ImageSourcePropType;
  export default source;
}
