export interface Logger {
  info(message: string): void;
  error(message: string): void;
}

export const logger: Logger = {
  info: (message: string) => {
    console.log(message);
  },
  error: (message: string) => {
    console.error(message);
  },
};
