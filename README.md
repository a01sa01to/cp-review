# cp-review.a01sa01to.com

競プロ復習ツール

## モデル

$b$ を節約率 $(0 \le b \le 1)$、 $t$ を経過時間 (分) とすると、エビングハウスの忘却曲線の「節約率」の近似として
$$b(t) = \frac{k}{(\log_{10}t)^{c} + k} (c=1.25, k=1.84)$$
があるらしいので、 (厳密には違うが) "忘却量" を $f = 1 - b$ とすると
$$f(t) = \frac{(\log_{10}t)^c}{(\log_{10}t)^c + k}$$
となる。

問題を $n (\ge 1)$ 回解いたとする。
$i$ 回目に解いた時刻は $t_i$ とする (最初に解いた時を基準とする: $t_1 = 0$)。
今、時刻 $t = t_{n+1}$ において問題を解くとすると、その時点での忘却量は
$$\prod_{i=1}^{n} f(t_{i+1} - t_i) = f(t_2 - t_1) \cdot f(t_3 - t_2) \cdot \dots \cdot f(t - t_{n})$$
で表現できそう。

また、どう考えても難易度の低い問題はすぐに方針が立ちそう。
ということでちょっとだけ diff も考慮する。
なんとなくグラフを見ながら良さそうだったので $1 + \frac{d}{8000}$ をかけることにした。 ($d$ は diff)

以上をまとめて、
$$\left( 1 + \frac{d}{8000} \right) \prod_{i=1}^{n} f(t_{i+1} - t_i)$$
が大きいものを優先して復習することにする。

### 参考

- <https://ja.wikipedia.org/wiki/%E5%BF%98%E5%8D%B4%E6%9B%B2%E7%B7%9A>
- <https://www.jstage.jst.go.jp/article/pacjpa/78/0/78_1EV-1-091/_pdf/-char/ja>
