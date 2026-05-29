export class ToolkitError extends Error {
  public readonly code: string;
  public readonly details?: unknown;

  public constructor(code: string, message: string, details?: unknown) {
    super(message);
    this.name = 'ToolkitError';
    this.code = code;
    this.details = details;
  }
}
