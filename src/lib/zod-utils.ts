import z from "zod";

export namespace ZodUtils {
  export const FormatIssuesAsMessage = (issues: z.core.$ZodIssue[]) => {
    let result = "";
    for (const issue of issues) {
      result = `${result}\n❌ Expected ${issue.path[0] as string} to be ${
        (issue as any).expected
      }`;
    }
    return result;
  };
}
