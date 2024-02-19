import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");

import acList from "@/data/ac_list.json";
import ignoreList from "@/data/ignore_list.json";

import type { ProblemModel } from "./interface";

export default async function Home() {
  const problems = new Map<string, [string, number[]]>();
  for (const ac of acList) {
    if (ignoreList.some((part) => ac.problem_id.includes(part))) continue;

    if (problems.has(ac.problem_id)) {
      problems.get(ac.problem_id)![1].push(ac.epoch_second);
    } else {
      problems.set(ac.problem_id, [ac.contest_id, [ac.epoch_second]]);
    }
  }

  const probModels = (await fetch(
    "https://kenkoooo.com/atcoder/resources/problem-models.json",
    {
      headers: {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "no-cache",
      },
    }
  ).then((res) => res.json())) as Record<string, ProblemModel>;

  // _t: 経過時間 (秒)
  const mem_f = (_t: number) => {
    // _t -> t (日)
    const t = _t / 86400;

    // すぐ解くと意味がないので、 10 日未満はなかったことにする
    if (t < 10) return 1;

    const c = 1.25;
    const k = 1.84;
    return Math.pow(Math.log10(t), c) / (k + Math.pow(Math.log10(t), c));
  };

  const now = dayjs().tz().unix();
  const lists = Array.from(problems.entries())
    .map(([problem_id, [contest_id, list]]) => {
      let diff = probModels[problem_id]?.difficulty ?? -1;
      if (diff !== -1 && diff < 400)
        diff = Math.round(400 / Math.exp(1 - diff / 400));

      let priority = 1e5;

      if (list.length === 0) {
        // なんか変だよ
      } else if (list.slice(-1)[0] + 86400 * 10 >= now) {
        // 10 日以内に解いた
        priority = -1;
      } else {
        let res = (1 + diff / 8000) * 1000; // max を 1500 くらいにするため
        list.push(now);
        for (let i = 1; i < list.length; i++)
          res *= mem_f(list[i] - list[i - 1]);
        priority = res;
      }

      return { contest_id, problem_id, diff, priority };
    })
    .sort((a, b) => b.priority - a.priority);

  return (
    <>
      <table>
        <tr>
          <th>ID</th>
          <th>Link</th>
          <th>Diff</th>
          <th>Priority</th>
        </tr>
        {lists.map((prob) => (
          <tr key={prob.problem_id}>
            <td>{prob.problem_id}</td>
            <td>
              <a
                href={`https://atcoder.jp/contests/${prob.contest_id}/tasks/${prob.problem_id}`}
              >
                Link
              </a>
            </td>
            <td>{prob.diff}</td>
            <td>{prob.priority.toFixed(2)}</td>
          </tr>
        ))}
      </table>
    </>
  );
}
