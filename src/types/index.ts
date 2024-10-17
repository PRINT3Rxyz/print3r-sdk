export interface SDKOptions {
  customId: string;
  colorScheme: "light" | "dark" | "custom";
  customColors?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}
