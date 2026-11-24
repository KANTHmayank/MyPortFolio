import time
from datetime import datetime, timezone
from typing import Any, Dict, List
import httpx

LEETCODE_USERNAME = "_mayank_kanth_"
LEETCODE_PROFILE_URL = f"https://leetcode.com/u/{LEETCODE_USERNAME}/"
LEETCODE_GITHUB_REPO = "https://github.com/KANTHmayank/LeetCode"
CACHE_TTL_SECONDS = 900  # 15 minutes

_cache: Dict[str, Any] = {"timestamp": 0.0, "data": None}

# Verified baseline snapshot used as instant fallback if LeetCode GraphQL is unreachable
FALLBACK_LEETCODE_DATA: Dict[str, Any] = {
    "username": LEETCODE_USERNAME,
    "profile_url": LEETCODE_PROFILE_URL,
    "github_solutions_url": LEETCODE_GITHUB_REPO,
    "source": "cached_snapshot",
    "total_solved": 176,
    "difficulty_breakdown": {"Easy": 54, "Medium": 101, "Hard": 21},
    "top_topics": [
        {"topic": "Array", "solved": 99},
        {"topic": "Binary Search", "solved": 30},
        {"topic": "Dynamic Programming", "solved": 29},
        {"topic": "Two Pointers", "solved": 29},
        {"topic": "String", "solved": 29},
        {"topic": "Hash Table", "solved": 27},
        {"topic": "Linked List", "solved": 24},
        {"topic": "Greedy", "solved": 23},
        {"topic": "Sorting", "solved": 23},
        {"topic": "Stack", "solved": 22},
        {"topic": "Math", "solved": 20},
        {"topic": "Tree / Binary Tree", "solved": 16},
        {"topic": "Depth-First Search", "solved": 14},
        {"topic": "Sliding Window", "solved": 14},
        {"topic": "Breadth-First Search", "solved": 11},
    ],
    "recent_solved": [
        {"title": "Task Scheduler", "slug": "task-scheduler"},
        {"title": "Minimum Number of Refueling Stops", "slug": "minimum-number-of-refueling-stops"},
        {"title": "Course Schedule III", "slug": "course-schedule-iii"},
        {"title": "IPO", "slug": "ipo"},
        {"title": "Last Stone Weight", "slug": "last-stone-weight"},
        {"title": "Reorganize String", "slug": "reorganize-string"},
        {"title": "K Closest Points to Origin", "slug": "k-closest-points-to-origin"},
        {"title": "Top K Frequent Words", "slug": "top-k-frequent-words"},
        {"title": "Top K Frequent Elements", "slug": "top-k-frequent-elements"},
        {"title": "Kth Largest Element in an Array", "slug": "kth-largest-element-in-an-array"},
        {"title": "Kth Smallest Number in Multiplication Table", "slug": "kth-smallest-number-in-multiplication-table"},
        {"title": "Kth Smallest Element in a Sorted Matrix", "slug": "kth-smallest-element-in-a-sorted-matrix"},
        {"title": "Search a 2D Matrix II", "slug": "search-a-2d-matrix-ii"},
        {"title": "Search a 2D Matrix", "slug": "search-a-2d-matrix"},
    ],
}

GRAPHQL_QUERY = """
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    username
    profile { ranking }
    submitStats: submitStatsGlobal {
      acSubmissionNum { difficulty count }
    }
    tagProblemCounts {
      advanced { tagName problemsSolved }
      intermediate { tagName problemsSolved }
      fundamental { tagName problemsSolved }
    }
  }
  recentAcSubmissionList(username: $username, limit: 15) {
    title
    titleSlug
    timestamp
  }
}
"""


def _fetch_live_leetcode() -> Dict[str, Any]:
    with httpx.Client(timeout=3.5) as client:
        resp = client.post(
            "https://leetcode.com/graphql",
            json={"query": GRAPHQL_QUERY, "variables": {"username": LEETCODE_USERNAME}},
            headers={
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0",
                "Referer": "https://leetcode.com",
            },
        )
        resp.raise_for_status()
        payload = resp.json()

    data = payload.get("data") or {}
    user = data.get("matchedUser")
    if not user:
        raise ValueError("LeetCode user not found in GraphQL response")

    ac_nums = (user.get("submitStats") or {}).get("acSubmissionNum") or []
    diff_map: Dict[str, int] = {}
    total_solved = 0
    for entry in ac_nums:
        diff = entry.get("difficulty")
        count = int(entry.get("count", 0))
        if diff == "All":
            total_solved = count
        elif diff in ("Easy", "Medium", "Hard"):
            diff_map[diff] = count

    tag_groups = user.get("tagProblemCounts") or {}
    topic_counts: Dict[str, int] = {}
    for level in ("fundamental", "intermediate", "advanced"):
        for item in tag_groups.get(level) or []:
            name = item.get("tagName")
            solved = int(item.get("problemsSolved", 0))
            if name and solved > 0:
                topic_counts[name] = max(topic_counts.get(name, 0), solved)

    top_topics = [
        {"topic": k, "solved": v}
        for k, v in sorted(topic_counts.items(), key=lambda kv: kv[1], reverse=True)[:15]
    ]

    seen_slugs = set()
    recent_solved: List[Dict[str, Any]] = []
    for sub in data.get("recentAcSubmissionList") or []:
        slug = sub.get("titleSlug")
        if not slug or slug in seen_slugs:
            continue
        seen_slugs.add(slug)
        ts = sub.get("timestamp")
        solved_date = None
        if ts:
            try:
                solved_date = datetime.fromtimestamp(int(ts), tz=timezone.utc).strftime("%Y-%m-%d")
            except Exception:
                solved_date = None
        recent_solved.append({
            "title": sub.get("title"),
            "slug": slug,
            "url": f"https://leetcode.com/problems/{slug}/",
            "date": solved_date,
        })

    return {
        "username": LEETCODE_USERNAME,
        "profile_url": LEETCODE_PROFILE_URL,
        "github_solutions_url": LEETCODE_GITHUB_REPO,
        "source": "live_graphql",
        "ranking": (user.get("profile") or {}).get("ranking"),
        "total_solved": total_solved or FALLBACK_LEETCODE_DATA["total_solved"],
        "difficulty_breakdown": diff_map or FALLBACK_LEETCODE_DATA["difficulty_breakdown"],
        "top_topics": top_topics or FALLBACK_LEETCODE_DATA["top_topics"],
        "recent_solved": recent_solved or FALLBACK_LEETCODE_DATA["recent_solved"],
    }


def get_leetcode_summary() -> Dict[str, Any]:
    """Return cached live LeetCode profile stats, topics, and recent accepted submissions."""
    now = time.time()
    if _cache["data"] is not None and (now - _cache["timestamp"]) < CACHE_TTL_SECONDS:
        return _cache["data"]

    try:
        live = _fetch_live_leetcode()
        _cache["data"] = live
        _cache["timestamp"] = now
        return live
    except Exception:
        # Serve stale cache if available, otherwise verified baseline snapshot
        if _cache["data"] is not None:
            return _cache["data"]
        return FALLBACK_LEETCODE_DATA


def format_leetcode_for_prompt() -> str:
    """Format LeetCode statistics, preferred topics, and recent questions for LLM grounding."""
    lc = get_leetcode_summary()
    diff = lc.get("difficulty_breakdown", {})
    topics_str = ", ".join(f"{t['topic']} ({t['solved']})" for t in lc.get("top_topics", [])[:12])
    recent_lines = []
    for item in lc.get("recent_solved", [])[:12]:
        date_part = f" [{item['date']}]" if item.get("date") else ""
        recent_lines.append(f"  - {item['title']}{date_part}")
    recent_str = "\n".join(recent_lines)

    return (
        f"Username: {lc['username']} ({lc['profile_url']})\n"
        f"GitHub Solutions Repository: {lc['github_solutions_url']}\n"
        f"Total Problems Solved: {lc['total_solved']} "
        f"(Easy: {diff.get('Easy', 0)}, Medium: {diff.get('Medium', 0)}, Hard: {diff.get('Hard', 0)})\n"
        f"Most Practiced / Preferred DSA Topics: {topics_str}\n"
        f"Most Recently Solved Accepted Questions (latest first):\n{recent_str}"
    )
