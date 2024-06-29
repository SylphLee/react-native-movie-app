import "styled-components";

// and extend them!
declare module "styled-components" {
  export interface DefaultTheme {
    mainBgColor: string;
    subBgColor: string;
    textColor: string;
    accentColor: string;
  }
}