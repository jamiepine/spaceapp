// import original module declarations
import 'styled-components';
// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    // global
    highlight: string;
    // theme
    background: string;
    sidebar: string;
    text: string;
    button: string;
    buttonFaint: string;
    border: string;
    borderLight: string;
    borderDark: string;
    textFaint: string;
    file: string;
    fileHover: string;
    fileBorder: string;
    headerBackground: string;
    headerButton: string;
  }
}
