#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dear ANG index.html 單一化整理器

用途：
- 不改頁面排列、功能入口順序、素材路徑與主要操作流程。
- 移除已被 v75/v76/v77 取代的舊 JS 覆蓋層。
- 清掉瀏覽器「另存網頁」帶回來的重複摩天輪車廂與輪輻。
- 清掉已經永久 display:none 的舊開場文字、假天氣 DOM（lean 模式）。
- 保留一份原檔備份與整理報告。

使用：
    python dearang_simplify.py index.html
或：
    python dearang_simplify.py index.html --output index_simplified.html --lean
"""

from __future__ import annotations

import argparse
import codecs
import re
import shutil
import sys
from collections import Counter
from pathlib import Path
from typing import Iterable, Tuple


OBSOLETE_SCRIPT_MARKERS = (
    "v64 R2 車廂圖片路徑備援",
    "v66 MiniWorld Frame 天氣背景",
    "v68 weather-mini 正確檔名",
    "v71-weather-default",
    "v72-restore-gate-opening",
    "v73-app-safe-opening-frame",
)

# 這兩段位於主程式 script 內，不是獨立 script。
OBSOLETE_IIFE_MARKERS = (
    "v55：木框天氣文字強制簡短",
    "v56：mini-frame 分成 11 個天氣影片",
)

IMPORTANT_FUNCTIONS = (
    "startOpeningMemoryCountdown",
    "finishOpeningMemoryCountdown",
    "setupMiniFrameVideo",
    "setMemoryWeather",
    "showMiniWorld",
    "openPage",
    "closePage",
    "playLetterAudio",
    "stopLetterAudio",
)


def read_text(path: Path) -> Tuple[str, str]:
    raw = path.read_bytes()
    for enc in ("utf-8-sig", "utf-8", "cp950", "big5"):
        try:
            return raw.decode(enc), enc
        except UnicodeDecodeError:
            pass
    raise UnicodeError("無法辨識檔案編碼；請先另存為 UTF-8。")


def write_text(path: Path, text: str) -> None:
    path.write_text(text, encoding="utf-8", newline="\n")


def strip_version_comments(text: str) -> str:
    # HTML 版號備註；保留一般內容註解。
    text = re.sub(
        r"<!--\s*(?:DearANG\s+)?v\d+[^\n]*?-->[ \t]*\n?",
        "",
        text,
        flags=re.I,
    )
    text = re.sub(
        r"<!--\s*v\d+[-\w：][\s\S]*?-->[ \t]*\n?",
        "",
        text,
        flags=re.I,
    )
    # CSS / JS 區塊標題只移除註解文字，不移除區塊。
    text = re.sub(
        r"/\*\s*=+\s*v\d+[^\n]*?=+\s*\*/[ \t]*\n?",
        "",
        text,
        flags=re.I,
    )
    return text


def remove_script_blocks(text: str, markers: Iterable[str]) -> Tuple[str, list[str]]:
    removed: list[str] = []
    pattern = re.compile(r"<script\b([^>]*)>([\s\S]*?)</script\s*>", re.I)

    def repl(m: re.Match[str]) -> str:
        body = m.group(2)
        hit = next((marker for marker in markers if marker in body), None)
        if hit:
            removed.append(hit)
            return "\n"
        return m.group(0)

    return pattern.sub(repl, text), removed


def find_matching_brace(text: str, open_pos: int) -> int:
    """回傳與 text[open_pos]=='{' 對應的 } 位置；忽略字串、模板、註解。"""
    depth = 0
    i = open_pos
    n = len(text)
    quote = None
    escape = False
    line_comment = False
    block_comment = False
    template_expr_depth = 0

    while i < n:
        ch = text[i]
        nxt = text[i + 1] if i + 1 < n else ""

        if line_comment:
            if ch == "\n":
                line_comment = False
            i += 1
            continue

        if block_comment:
            if ch == "*" and nxt == "/":
                block_comment = False
                i += 2
            else:
                i += 1
            continue

        if quote:
            if escape:
                escape = False
            elif ch == "\\":
                escape = True
            elif quote == "`" and ch == "$" and nxt == "{":
                # 模板字串內的 ${...} 仍需計算大括號。
                template_expr_depth += 1
                depth += 1
                i += 2
                continue
            elif ch == quote and (quote != "`" or template_expr_depth == 0):
                quote = None
            elif quote == "`" and ch == "}" and template_expr_depth > 0:
                template_expr_depth -= 1
                depth -= 1
            i += 1
            continue

        if ch == "/" and nxt == "/":
            line_comment = True
            i += 2
            continue
        if ch == "/" and nxt == "*":
            block_comment = True
            i += 2
            continue
        if ch in ("'", '"', "`"):
            quote = ch
            i += 1
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return i
        i += 1

    return -1


def remove_marked_iife(text: str, marker: str) -> Tuple[str, bool]:
    pos = text.find(marker)
    if pos < 0:
        return text, False

    # 往前找此 marker 所在註解開頭，往後找 IIFE 的 function 大括號。
    comment_start = text.rfind("/*", 0, pos)
    start = comment_start if comment_start >= 0 else pos
    fn_pos = text.find("(function", pos)
    if fn_pos < 0:
        return text, False
    brace = text.find("{", fn_pos)
    if brace < 0:
        return text, False
    close = find_matching_brace(text, brace)
    if close < 0:
        return text, False

    # 接著吞掉 IIFE 尾端的 )(); / })();
    tail = close + 1
    tail_match = re.match(r"\s*\)\s*\(\s*\)\s*;?", text[tail:])
    if not tail_match:
        tail_match = re.match(r"\s*\}\s*\)\s*\(\s*\)\s*;?", text[tail:])
    if tail_match:
        end = tail + tail_match.end()
    else:
        # 常見實際形式是 close 已是 function 的 }，後面為 )();
        semi = text.find(";", tail, tail + 30)
        end = semi + 1 if semi >= 0 else tail

    return text[:start] + "\n" + text[end:], True


def remove_function_declaration_before(
    text: str, function_name: str, before_marker: str
) -> Tuple[str, int]:
    """
    只移除 before_marker 之前的 `function name(...) { ... }`。
    最終 v75 仍會提供 window.name，因此不改呼叫端。
    """
    boundary = text.find(before_marker)
    if boundary < 0:
        return text, 0

    removed = 0
    search_pos = 0
    signature = re.compile(rf"\bfunction\s+{re.escape(function_name)}\s*\(")

    while True:
        m = signature.search(text, search_pos, boundary)
        if not m:
            break
        brace = text.find("{", m.end(), boundary)
        if brace < 0:
            break
        close = find_matching_brace(text, brace)
        if close < 0 or close >= boundary:
            break
        end = close + 1
        while end < len(text) and text[end] in " \t":
            end += 1
        if end < len(text) and text[end] == ";":
            end += 1
        if end < len(text) and text[end] == "\r":
            end += 1
        if end < len(text) and text[end] == "\n":
            end += 1
        text = text[:m.start()] + "\n" + text[end:]
        delta = end - m.start() - 1
        boundary -= delta
        removed += 1
        search_pos = m.start()

    return text, removed


def reset_runtime_snapshot_markup(text: str) -> Tuple[str, list[str]]:
    changes: list[str] = []

    # v57 會自己建立 20 根輪輻；另存網頁後不應保留執行結果。
    new_text, n = re.subn(
        r'(<div\b[^>]*\bid=["\']photoWheelSpokes["\'][^>]*>)[\s\S]*?(</div>)',
        r"\1\2",
        text,
        count=1,
        flags=re.I,
    )
    if n:
        text = new_text
        changes.append("清空已預先生成的 photoWheelSpokes")

    # v57 會自己建立車廂；保留靜態 8 車廂會造成再生成一次。
    new_text, n = re.subn(
        r'(<div\b[^>]*\bid=["\']photoWheelCabins["\'][^>]*>)[\s\S]*?(</div>)',
        r"\1\2",
        text,
        count=1,
        flags=re.I,
    )
    if n:
        text = new_text
        changes.append("清空已預先生成的 photoWheelCabins")

    # 解除執行期綁定旗標，讓原本初始化函式正常綁一次。
    text, n = re.subn(
        r'\sdata-real-photo-bound=["\']1["\']',
        "",
        text,
        flags=re.I,
    )
    if n:
        changes.append("移除 photoWheel 執行期綁定旗標")

    # 靜態日期會在 JS 啟動前閃出舊天數；保留容器，交由既有 v63 計算。
    new_text, n = re.subn(
        r'(<div\b[^>]*\bid=["\']departureDayCounter["\'][^>]*>)[\s\S]*?(</div>)',
        r"\1\2",
        text,
        count=1,
        flags=re.I,
    )
    if n:
        text = new_text
        changes.append("清空過期的離開天數靜態文字")

    # 不改實際 offset，只刪除不相符的舊註解。
    text = re.sub(
        r"(const\s+LYRIC_OFFSET_SECONDS\s*=\s*[^;]+;)\s*//[^\n]*",
        r"\1",
        text,
        count=1,
    )

    return text, changes


def remove_single_element_by_class(text: str, class_name: str) -> Tuple[str, int]:
    # 適用於內容不含同名閉合標籤的簡單 div/button。
    pattern = re.compile(
        rf'<(?P<tag>div|button)\b(?=[^>]*\bclass=["\'][^"\']*\b{re.escape(class_name)}\b[^"\']*["\'])[^>]*>'
        rf'[\s\S]*?</(?P=tag)\s*>',
        re.I,
    )
    return pattern.subn("\n", text, count=1)


def remove_lean_dead_dom(text: str) -> Tuple[str, list[str]]:
    changes: list[str] = []

    # v21 起永久隱藏、且 v75 不再使用的舊倒數文字。
    for cls in (
        "credit-kicker",
        "opening-countdown-title",
        "opening-countdown-sub",
        "opening-number",
        "opening-photo-draw",
        "opening-start-note",
    ):
        # credit-kicker 在其他區域也有，所以只處理 opening-countdown-card 內會更安全。
        if cls == "credit-kicker":
            continue
        text, n = remove_single_element_by_class(text, cls)
        if n:
            changes.append(f"移除隱藏舊開場節點 .{cls}")

    # 精準移除 opening card 內的舊 credit-kicker。
    text, n = re.subn(
        r'(<div\b[^>]*class=["\'][^"\']*\bopening-countdown-card\b[^"\']*["\'][^>]*>[\s\S]*?)'
        r'<div\b[^>]*class=["\'][^"\']*\bcredit-kicker\b[^"\']*["\'][^>]*>[\s\S]*?</div>',
        r"\1",
        text,
        count=1,
        flags=re.I,
    )
    if n:
        changes.append("移除隱藏舊開場 credit-kicker")

    # Mini World 最終只使用 frame video、透明入口、radio；假天氣圖層永久關閉。
    for element_id in ("miniWorldBg", "miniWorldWeather", "miniWeatherStatus", "miniWeatherButtons"):
        pattern = re.compile(
            rf'<(?P<tag>div|img)\b[^>]*\bid=["\']{re.escape(element_id)}["\'][^>]*'
            rf'(?:/>|>[\s\S]*?</(?P=tag)\s*>)',
            re.I,
        )
        text, n = pattern.subn("\n", text, count=1)
        if n:
            changes.append(f"移除已停用 #{element_id}")

    for cls in ("mini-screen-shine", "mini-screen-hint", "treasure-map-hit"):
        text, n = remove_single_element_by_class(text, cls)
        if n:
            changes.append(f"移除已停用 .{cls}")

    # 空的 mini-world-panel（內部按鈕已移除）整段刪除。
    text, n = re.subn(
        r'<div\b[^>]*class=["\'][^"\']*\bmini-world-panel\b[^"\']*["\'][^>]*>'
        r'[\s\S]*?</div>\s*</div>',
        "",
        text,
        count=1,
        flags=re.I,
    )
    if n:
        changes.append("移除已停用 Mini World 天氣面板")

    return text, changes


def collapse_blank_lines(text: str) -> str:
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{4,}", "\n\n\n", text)
    return text.strip() + "\n"


def count_named_functions(text: str) -> dict[str, int]:
    return {
        name: len(re.findall(rf"\bfunction\s+{re.escape(name)}\s*\(", text))
        + len(re.findall(rf"\bwindow\.{re.escape(name)}\s*=\s*function\b", text))
        for name in IMPORTANT_FUNCTIONS
    }


def duplicate_ids(text: str) -> dict[str, int]:
    ids = re.findall(r'\bid=["\']([^"\']+)["\']', text, flags=re.I)
    return {k: v for k, v in Counter(ids).items() if v > 1}


def main() -> int:
    parser = argparse.ArgumentParser(description="整理 Dear ANG index.html 的重複覆蓋層。")
    parser.add_argument("input", nargs="?", default="index.html", help="來源 HTML，預設 index.html")
    parser.add_argument("--output", "-o", default="", help="輸出 HTML")
    parser.add_argument("--lean", action="store_true", help="另外移除永久隱藏的舊 DOM")
    args = parser.parse_args()

    src = Path(args.input).expanduser().resolve()
    if not src.exists():
        print(f"[錯誤] 找不到：{src}")
        print("請把 dearang_simplify.py 和 index.html 放在同一資料夾後再執行。")
        return 2

    dst = (
        Path(args.output).expanduser().resolve()
        if args.output
        else src.with_name(src.stem + "_simplified" + src.suffix)
    )
    backup = src.with_name(src.name + ".before_simplify.bak")
    report_path = dst.with_suffix(dst.suffix + ".report.txt")

    text, encoding = read_text(src)
    original = text
    before_functions = count_named_functions(text)
    before_ids = duplicate_ids(text)

    removed: list[str] = []
    changes: list[str] = []

    # 先移除完整的舊 script，以免後面再處理其中內容。
    text, removed_scripts = remove_script_blocks(text, OBSOLETE_SCRIPT_MARKERS)
    removed.extend("舊 script：" + x for x in removed_scripts)

    # 移除主 script 內已被 v75 完整取代的舊 IIFE。
    for marker in OBSOLETE_IIFE_MARKERS:
        text, ok = remove_marked_iife(text, marker)
        if ok:
            removed.append("舊 IIFE：" + marker)

    # v75 提供最終開場與 Mini Frame；刪除它之前的同名舊宣告。
    if "v75-final" in text:
        for fn in (
            "startOpeningMemoryCountdown",
            "finishOpeningMemoryCountdown",
            "setupMiniFrameVideo",
        ):
            text, n = remove_function_declaration_before(text, fn, "v75-final")
            if n:
                removed.append(f"v75 前舊函式 {fn} × {n}")

    # v63 提供錄音淡化與恢復；刪除更前面的基本重複函式。
    if "v63 錄音播放時" in text:
        for fn in ("playLetterAudio", "stopLetterAudio"):
            text, n = remove_function_declaration_before(text, fn, "v63 錄音播放時")
            if n:
                removed.append(f"v63 前舊函式 {fn} × {n}")

    text, snapshot_changes = reset_runtime_snapshot_markup(text)
    changes.extend(snapshot_changes)

    if args.lean:
        text, lean_changes = remove_lean_dead_dom(text)
        changes.extend(lean_changes)

    text = strip_version_comments(text)
    text = collapse_blank_lines(text)

    # 保留原始檔；已存在備份時不覆蓋。
    if not backup.exists():
        shutil.copy2(src, backup)

    write_text(dst, text)

    after_functions = count_named_functions(text)
    after_ids = duplicate_ids(text)

    report = [
        "Dear ANG 單一化整理報告",
        "=" * 44,
        f"來源：{src}",
        f"輸出：{dst}",
        f"備份：{backup}",
        f"讀取編碼：{encoding}",
        f"模式：{'lean' if args.lean else 'safe'}",
        "",
        f"原始大小：{len(original.encode('utf-8')):,} bytes",
        f"整理大小：{len(text.encode('utf-8')):,} bytes",
        f"減少：{len(original.encode('utf-8')) - len(text.encode('utf-8')):,} bytes",
        "",
        "已移除的舊覆蓋：",
    ]
    report.extend(f"- {x}" for x in removed)
    if not removed:
        report.append("- 沒有找到指定舊覆蓋標記")

    report.append("")
    report.append("其他整理：")
    report.extend(f"- {x}" for x in changes)
    if not changes:
        report.append("- 無")

    report.extend(
        [
            "",
            "重要函式定義數（整理前 → 整理後）：",
        ]
    )
    for name in IMPORTANT_FUNCTIONS:
        report.append(f"- {name}: {before_functions[name]} → {after_functions[name]}")

    report.extend(
        [
            "",
            "重複 ID：",
            f"- 整理前：{before_ids or '無'}",
            f"- 整理後：{after_ids or '無'}",
            "",
            "注意：",
            "- 本工具不改頁面 section 的排列順序。",
            "- 本工具不改素材路徑、GAS URL、歌詞時間值、場館入口順序。",
            "- 請先以輸出檔測試；確認正常後再改名為 index.html。",
        ]
    )
    write_text(report_path, "\n".join(report) + "\n")

    print("[完成]")
    print(f"輸出：{dst}")
    print(f"備份：{backup}")
    print(f"報告：{report_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
