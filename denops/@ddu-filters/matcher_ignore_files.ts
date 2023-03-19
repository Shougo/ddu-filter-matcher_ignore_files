import { BaseFilter, DduItem } from "https://deno.land/x/ddu_vim@v2.5.0/types.ts";
import { Denops } from "https://deno.land/x/ddu_vim@v2.5.0/deps.ts";
import { ActionData } from "https://deno.land/x/ddu_kind_file@v0.3.2/file.ts";

type Params = {
  ignorePatterns: string[];
};

export class Filter extends BaseFilter<Params> {
  // deno-lint-ignore require-await
  override async filter(args: {
    denops: Denops;
    filterParams: Params;
    items: DduItem[];
  }): Promise<DduItem[]> {
    return Promise.resolve(args.items.filter(
      (item) => {
        const action = item.action as ActionData;
        if (!action.path) { return false; }
        for (const pattern of args.filterParams.ignorePatterns) {
          if (action.path.search(pattern) >= 0) {
            return false;
          }
        }
        return true;
      }
    ));
  }

  override params(): Params {
    return {
      ignorePatterns: [],
    };
  }
}
