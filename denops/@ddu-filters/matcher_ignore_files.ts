import {
  BaseFilter,
  DduItem,
} from "https://deno.land/x/ddu_vim@v4.0.0/types.ts";
import { Denops } from "https://deno.land/x/ddu_vim@v4.0.0/deps.ts";
import { ActionData } from "https://deno.land/x/ddu_kind_file@v0.7.1/file.ts";
import { globToRegExp } from "jsr:@std/path@0.224.0";

type Params = {
  ignoreGlobs: string[];
  ignorePatterns: string[];
};

export class Filter extends BaseFilter<Params> {
  override filter(args: {
    denops: Denops;
    filterParams: Params;
    items: DduItem[];
  }): Promise<DduItem[]> {
    const ignoreGlobs = args.filterParams.ignoreGlobs.map(
      (glob) => globToRegExp("**/" + glob),
    );

    return Promise.resolve(args.items.filter(
      (item) => {
        const action = item.action as ActionData;
        if (!action.path) return false;
        for (const pattern of args.filterParams.ignorePatterns) {
          if (action.path.search(pattern) >= 0) {
            return false;
          }
        }
        for (const glob of ignoreGlobs) {
          if (glob.test(action.path)) {
            return false;
          }
        }
        return true;
      },
    ));
  }

  override params(): Params {
    return {
      ignoreGlobs: [],
      ignorePatterns: [],
    };
  }
}
