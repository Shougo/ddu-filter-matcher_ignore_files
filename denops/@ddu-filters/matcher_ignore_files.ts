import {
  BaseFilter,
  DduItem,
} from "https://deno.land/x/ddu_vim@v3.5.0/types.ts";
import { Denops } from "https://deno.land/x/ddu_vim@v3.5.0/deps.ts";
import { ActionData } from "https://deno.land/x/ddu_kind_file@v0.5.3/file.ts";
import { globToRegExp } from "https://deno.land/std@0.198.0/path/glob.ts";

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
